"""
main.py — FastAPI entry point for the Document Processing Service.

Endpoints:
  GET  /health              — liveness check
  POST /process-document    — main processing endpoint

Accepts:
  Multipart file upload  OR  JSON body with file_url
  Optional metadata fields: user_id, file_type, bank_name
"""

from __future__ import annotations

import asyncio
import os
import traceback
from typing import Optional

from dotenv import load_dotenv

# Load .env from document-service root (makes GEMINI_API_KEY available)
load_dotenv()

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl

from app.utils import (
    detect_file_type,
    fetch_file_from_url,
    is_image_type,
    is_pdf_type,
    setup_logger,
    validate_file_size,
)
from app.pdf_parser import parse_pdf, pdf_pages_to_images
from app.ocr import extract_text_from_image, extract_text_from_images
# from app.table_extractor import extract_tables  # Disabled - camelot dependency issues
from app.normalizer import (
    normalize_text,
    normalize_table_rows,
    llm_normalize,
    NormalizeResult,
)

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

logger = setup_logger("main")

app = FastAPI(
    title="PayLockr Document Processing Service",
    description="Extracts structured financial transactions from PDFs and images.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Lock down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class UrlRequest(BaseModel):
    file_url: str
    user_id: Optional[str] = None
    file_type: Optional[str] = None
    bank_name: Optional[str] = None


class Transaction(BaseModel):
    date: str
    description: str
    amount: float
    type: str
    balance: Optional[float] = None


class ProcessResponse(BaseModel):
    transactions: list[Transaction]
    confidence: float
    pages_processed: int = 0
    extraction_method: str = "regex"


class ErrorResponse(BaseModel):
    error: str
    detail: str


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health", tags=["system"])
async def health():
    """Liveness probe — returns 200 when the service is up."""
    return {"status": "ok", "service": "document-processing"}


# ---------------------------------------------------------------------------
# Gemini Vision endpoint — simple image → transactions (like InkStrokes pattern)
# ---------------------------------------------------------------------------

EXTRACT_PROMPT = """You are a bank statement data extraction engine. You process both SCREENSHOT images and PDF-exported statements.

Extract EVERY transaction row. Return ONLY a raw JSON object — absolutely no markdown, no fences, no commentary.

JSON schema (one object per transaction):
{
  "transactions": [
    {
      "date": "YYYY-MM-DD or null if not visible",
      "description": "<copy the ENTIRE narration line exactly character-by-character>",
      "upi_ref": "<12-15 digit numeric UPI reference number, or null>",
      "source": "<the FULL NAME of the person or merchant — see rules below>",
      "amount": 0.00,
      "type": "debit or credit",
      "balance": 0.00
    }
  ],
  "confidence": 0.95
}

=== FULL NAME EXTRACTION (most important rule) ===
UPI narrations follow the format: UPI/DR-or-CR/REFNO/NAME/BANKIFSC/VPA
The NAME segment is often abbreviated in the storage key, but the ACTUAL name of the sender/receiver
may be spelled out more completely elsewhere in that same narration or in adjacent columns.

Rules for "source" field:
1. Scan ALL slash-separated segments in the narration for human names or merchant names.
2. Pick the LONGEST and most complete name segment as the source.
3. If the name looks like a VPA suffix (e.g. "chandra@okicici", "john.doe@ybl"), extract the full part before @ as the name.
4. NEVER abbreviate: use "CHANDRA KUMAR" not "CHANDRAK", "INDSTOCKS INDIA" not "INDSTK".
5. If you see both a short code and a full name in the narration (e.g. "INDSTOCKS" and "IndiaStocks Ltd"), use the longer full form.
6. For wallet payments (PPE, PAYTM, PHONEPE): the name comes before the wallet code — use it.
7. Copy the source EXACTLY as written in the statement — no guessing, no expanding abbreviations yourself.

=== STRICT FIELD RULES ===
- description: Verbatim entire narration. NEVER truncate. Every slash. Every character.
  CORRECT: "UPI/DR/978584154770/CHANDRA KUMAR/HDFC0000240/chandrk@paytm"
  WRONG:   "UPI/DR/978584154770/CHANDRA KUMAR/HDFC"  ← truncated
- upi_ref: ONLY the numeric reference (12-15 digits). null for non-UPI rows.
- date: YYYY-MM-DD. Convert DD-MM-YY, DD/MM/YYYY, etc. null if date column is blank/missing.
- amount: Positive number from the non-zero Debit or Credit column. null if completely unreadable.
- type: "debit" = money out (UPI/DR, withdrawal). "credit" = money in (UPI/CR, deposit, salary).
- balance: Running balance after this row. null if column absent.
- SKIP: column headers, opening balance, closing balance, subtotal/summary rows.
- Include ALL individual transaction rows without exception."""




@app.post("/extract-transactions", tags=["gemini-vision"])
async def extract_transactions(file: UploadFile = File(...)):
    """
    Upload a bank statement screenshot → Gemini 1.5 Flash Vision → structured transactions JSON.
    Calls the Gemini REST API directly via httpx — no google-generativeai package needed.
    """
    import json
    import base64
    import httpx

    # Get API key — loaded from .env at startup via load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY not set. Add it to document-service/.env and restart uvicorn."
        )

    # Read uploaded image bytes and encode to base64
    image_bytes = await file.read()
    mime_type = file.content_type or "image/png"
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    logger.info(f"[GeminiVision] Processing {file.filename} ({len(image_bytes)//1024} KB, {mime_type})")

    # Gemini REST API — v1beta with gemini-2.5-flash (stable, supports image input on free tier)
    # See: https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": EXTRACT_PROMPT},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": image_b64,
                        }
                    },
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0,
            "maxOutputTokens": 8192,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(url, json=payload)

        if response.status_code != 200:
            logger.error(f"[GeminiVision] API error {response.status_code}: {response.text[:300]}")
            raise HTTPException(status_code=502, detail=f"Gemini API error {response.status_code}: {response.text[:200]}")

        data = response.json()
        raw = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        logger.info(f"[GeminiVision] Raw response:\n{raw[:500]}")

        # Robustly strip markdown fences — handles ```json, ```JSON, ``` with/without newlines
        import re
        fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw, re.IGNORECASE)
        if fence_match:
            raw = fence_match.group(1).strip()
        elif raw.startswith("```"):
            # Fallback: remove all ``` markers line by line
            raw = "\n".join(
                line for line in raw.splitlines()
                if not line.strip().startswith("```")
            ).strip()

        # Gemini sometimes returns JSON with a trailing comma before } — fix it
        raw = re.sub(r",\s*([}\]])", r"\1", raw)

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError as e:
            logger.error(f"[GeminiVision] JSON parse failed: {e}\nRaw was:\n{raw[:800]}")
            raise HTTPException(
                status_code=502,
                detail=f"Gemini returned invalid JSON: {str(e)}. Raw: {raw[:200]}"
            )

        transactions = parsed.get("transactions", [])
        confidence = float(parsed.get("confidence", 0.93))

        # Validate and clean each transaction row
        # Must match the ParsedTransaction interface in geminiService.ts exactly:
        # { date, description, upi_ref, source, amount, type, balance }
        clean = []
        for t in transactions:
            try:
                date_val = t.get("date")
                upi_ref_val = t.get("upi_ref")
                source_val = t.get("source")

                clean.append({
                    "date": str(date_val) if date_val is not None and str(date_val).lower() != "null" else "",
                    "description": str(t.get("description") or "Transaction"),
                    "upi_ref": str(upi_ref_val) if upi_ref_val is not None and str(upi_ref_val).lower() != "null" else None,
                    "source": str(source_val).strip() if source_val not in (None, "", "null") else None,
                    "amount": float(t["amount"]) if t.get("amount") is not None else 0.0,
                    "type": "credit" if str(t.get("type", "")).lower() == "credit" else "debit",
                    "balance": float(t["balance"]) if t.get("balance") is not None and str(t.get("balance")).lower() != "null" else None,
                })
            except Exception as row_err:
                logger.warning(f"[GeminiVision] Skipping malformed row: {t} — {row_err}")
                continue  # skip malformed rows

        logger.info(f"[GeminiVision] Extracted {len(clean)} transactions (confidence={confidence})")
        return {"transactions": clean, "confidence": confidence, "source": "gemini-vision"}

    except json.JSONDecodeError as e:
        logger.error(f"[GeminiVision] JSON parse error: {e}\nRaw: {raw[:300]}")
        raise HTTPException(status_code=500, detail=f"Gemini returned invalid JSON: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[GeminiVision] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



# ---------------------------------------------------------------------------
# Main endpoint — multipart upload
# ---------------------------------------------------------------------------



# ---------------------------------------------------------------------------
# Main endpoint — multipart upload
# ---------------------------------------------------------------------------

@app.post(
    "/process-document",
    response_model=ProcessResponse,
    tags=["processing"],
    summary="Extract transactions from a bank statement or invoice",
)
async def process_document_upload(
    file: Optional[UploadFile] = File(default=None),
    file_url: Optional[str] = Form(default=None),
    user_id: Optional[str] = Form(default=None),
    bank_name: Optional[str] = Form(default=None),
):
    """
    Process a document via **multipart file upload** or **file_url** form field.

    - Accepts PDF (text or scanned) or images (JPEG, PNG, TIFF, etc.)
    - Returns structured transactions JSON
    """
    data, filename = await _resolve_input(file, file_url)
    return await _run_pipeline(data, filename, bank_name)


# ---------------------------------------------------------------------------
# Main endpoint — JSON body with file_url
# ---------------------------------------------------------------------------

@app.post(
    "/process-document/url",
    response_model=ProcessResponse,
    tags=["processing"],
    summary="Extract transactions from a URL-hosted document",
)
async def process_document_url(body: UrlRequest):
    """
    Process a document by URL (e.g. Supabase Storage public URL).

    TypeScript integration point — send the Supabase file URL directly.
    """
    try:
        data = await asyncio.wait_for(
            fetch_file_from_url(body.file_url), timeout=30.0
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Timeout fetching document from URL")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not fetch file: {exc}")

    return await _run_pipeline(data, body.file_url, body.bank_name)


# ---------------------------------------------------------------------------
# Global exception handler
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )


# ---------------------------------------------------------------------------
# Pipeline orchestration
# ---------------------------------------------------------------------------

async def _resolve_input(
    file: Optional[UploadFile],
    file_url: Optional[str],
) -> tuple[bytes, str]:
    """Resolve either a multipart file or a URL to raw bytes."""
    if file is not None:
        data = await file.read()
        validate_file_size(data)
        return data, file.filename or "upload"

    if file_url:
        try:
            data = await asyncio.wait_for(fetch_file_from_url(file_url), timeout=30.0)
            return data, file_url
        except asyncio.TimeoutError:
            raise HTTPException(status_code=504, detail="Timeout fetching document from URL")
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Could not fetch file: {exc}")

    raise HTTPException(
        status_code=422,
        detail="Provide either a 'file' multipart field or a 'file_url' form field.",
    )


async def _run_pipeline(
    data: bytes,
    source_name: str,
    bank_name: Optional[str],
) -> ProcessResponse:
    """Run the full extraction → normalization pipeline."""
    file_type = detect_file_type(data)
    logger.info(f"Processing '{source_name}' | type={file_type} | size={len(data)} bytes")

    result: NormalizeResult
    pages_processed = 0
    extraction_method = "regex"

    if is_image_type(file_type):
        # ── Image path ─────────────────────────────────────────────────────
        raw_text = extract_text_from_image(data)
        result = normalize_text(raw_text)
        pages_processed = 1
        extraction_method = "ocr"

    elif is_pdf_type(file_type):
        # ── PDF path ────────────────────────────────────────────────────────
        pdf_result = parse_pdf(data)
        pages_processed = len(pdf_result.pages)

        if pdf_result.is_scanned:
            # Scanned PDF → render pages → OCR
            logger.info("Scanned PDF detected — running per-page OCR")
            page_images = pdf_pages_to_images(data)
            raw_text = extract_text_from_images(page_images)
            result = normalize_text(raw_text)
            extraction_method = "ocr"

        else:
            # Text PDF → use text normalization (table extraction disabled)
            logger.info("Text PDF detected — using text normalization")
            result = normalize_text(pdf_result.full_text)
            extraction_method = "pdfplumber"

    else:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{file_type}'. Send a PDF or image.",
        )

    # ── Optional LLM normalization (Phase 2) ──────────────────────────────
    if result.transactions:
        raw_for_llm = (
            "\n".join(p.text for p in pdf_result.pages)
            if is_pdf_type(file_type) and not locals().get("raw_text")
            else locals().get("raw_text", "")
        )
        corrected = await llm_normalize(raw_for_llm, result.transactions)
        if corrected != result.transactions:
            result.transactions = corrected
            extraction_method += "+llm"

    logger.info(
        f"Pipeline complete — {len(result.transactions)} transactions "
        f"| confidence={result.confidence} | method={extraction_method}"
    )

    if not result.transactions:
        logger.warning("No transactions extracted — returning empty result")

    return ProcessResponse(
        transactions=[Transaction(**t.to_dict()) for t in result.transactions],
        confidence=result.confidence,
        pages_processed=pages_processed,
        extraction_method=extraction_method,
    )
