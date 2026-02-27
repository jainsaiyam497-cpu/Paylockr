/**
 * ocrService.ts
 *
 * Previously used Tesseract.js for OCR. Now delegates to Gemini Vision API
 * via extractTransactionsFromImage() in geminiService.ts for much higher accuracy.
 *
 * The original Tesseract-based implementation is preserved below as comments.
 */

import { extractTransactionsFromImage, ParsedStatement } from './geminiService';

// ─────────────────────────────────────────────────────────────────────────────
// Primary API — re-export Gemini Vision extraction
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scan a bank statement or invoice image and return structured transactions.
 * Uses Gemini Vision API — no Python backend needed.
 *
 * @example
 * const result = await scanStatement(file);
 * result.transactions.forEach(t => console.log(t.date, t.amount, t.type));
 */
export const scanStatement = async (imageFile: File): Promise<ParsedStatement> => {
  return extractTransactionsFromImage(imageFile);
};

// ─────────────────────────────────────────────────────────────────────────────
// Legacy helpers — kept for backward compatibility, now powered by Gemini
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use scanStatement() for bank statements.
 * Kept for backward compatibility. Returns first transaction data in the old shape.
 */
export const scanInvoice = async (imageFile: File): Promise<{
  text: string;
  amount?: number;
  date?: string;
  vendor?: string;
}> => {
  try {
    const result = await extractTransactionsFromImage(imageFile);
    const first = result.transactions[0];
    return {
      text: result.transactions.map(t => `${t.date} ${t.description} ${t.amount}`).join('\n'),
      amount: first?.amount,
      date: first?.date,
      vendor: first?.description,
    };
  } catch (error) {
    console.error('[ocrService] scanInvoice via Gemini failed:', error);
    throw new Error('Failed to scan document with Gemini Vision');
  }
};

export const scanReceipt = async (imageFile: File) => {
  return scanInvoice(imageFile);
};

export const extractExpenseData = async (imageFile: File): Promise<{
  category: string;
  amount: number;
  date: string;
  description: string;
}> => {
  try {
    // Use direct Gemini Vision API for receipt scanning
    const result = await scanReceiptDirect(imageFile);
    
    // Auto-categorize based on keywords in description using CATEGORIES keys
    const text = (result.vendor || result.description || '').toLowerCase();
    let category = 'SHOPPING'; // Default category

    if (text.includes('food') || text.includes('restaurant') || text.includes('cafe') || text.includes('swiggy') || text.includes('zomato') || text.includes('dominos') || text.includes('pizza')) {
      category = 'FOOD';
    } else if (text.includes('uber') || text.includes('ola') || text.includes('transport') || text.includes('rapido') || text.includes('taxi') || text.includes('flight') || text.includes('train')) {
      category = 'TRAVEL';
    } else if (text.includes('software') || text.includes('subscription') || text.includes('saas') || text.includes('netflix') || text.includes('spotify') || text.includes('adobe')) {
      category = 'SUBSCRIPTIONS';
    } else if (text.includes('office') || text.includes('supplies') || text.includes('amazon') || text.includes('flipkart')) {
      category = 'SHOPPING';
    } else if (text.includes('electricity') || text.includes('gas') || text.includes('water') || text.includes('internet') || text.includes('mobile') || text.includes('jio') || text.includes('airtel')) {
      category = 'UTILITIES';
    } else if (text.includes('hospital') || text.includes('pharmacy') || text.includes('doctor') || text.includes('medical') || text.includes('apollo') || text.includes('1mg')) {
      category = 'HEALTHCARE';
    } else if (text.includes('movie') || text.includes('cinema') || text.includes('bookmyshow') || text.includes('game') || text.includes('entertainment')) {
      category = 'ENTERTAINMENT';
    }

    return {
      category,
      amount: result.amount || 0,
      date: result.date || new Date().toISOString().split('T')[0],
      description: result.vendor || result.description || 'Scanned expense',
    };
  } catch (error) {
    console.error('[extractExpenseData] Error:', error);
    throw new Error('Failed to extract expense data from receipt');
  }
};

/**
 * Direct Gemini Vision API call for receipt/invoice scanning
 */
const scanReceiptDirect = async (imageFile: File): Promise<{
  amount: number;
  date: string;
  vendor: string;
  description: string;
}> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.');
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Convert file to base64
  const base64 = await fileToBase64(imageFile);
  const mimeType = imageFile.type;

  const prompt = `Extract expense data from this receipt/invoice image.

Return ONLY valid JSON (no markdown, no explanation):

{
  "amount": 0.00,
  "date": "YYYY-MM-DD",
  "vendor": "merchant name",
  "description": "item/service description"
}

RULES:
1. AMOUNT: Extract total amount (look for "Total", "Amount", "₹" symbols)
2. DATE: Convert any date format to YYYY-MM-DD
3. VENDOR: Extract merchant/store/company name
4. DESCRIPTION: Brief description of purchase/service
5. If any field is unclear, use reasonable defaults`;

  console.log(`[ReceiptScanner] Scanning ${imageFile.name}`);

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64,
        mimeType: mimeType
      }
    }
  ]);

  const responseText = result.response.text();
  console.log('[ReceiptScanner] Raw response:', responseText.substring(0, 200));

  try {
    const parsed = JSON.parse(responseText);
    return {
      amount: Number(parsed.amount) || 0,
      date: parsed.date || new Date().toISOString().split('T')[0],
      vendor: parsed.vendor || 'Unknown Merchant',
      description: parsed.description || 'Expense'
    };
  } catch (error) {
    console.error('[ReceiptScanner] JSON parse error:', error);
    throw new Error('Failed to parse receipt data');
  }
};

/**
 * Convert File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// ORIGINAL Tesseract.js implementation — preserved, not deleted
// ─────────────────────────────────────────────────────────────────────────────
//
// import Tesseract from 'tesseract.js';
//
// export const scanInvoice_TESSERACT = async (imageFile: File) => {
//   const result = await Tesseract.recognize(imageFile, 'eng', {
//     logger: (m) => console.log(m)
//   });
//   const text = result.data.text;
//   let amount: number | undefined;
//   const totalMatch = text.match(/(?:TOTAL|Total|total|Grand Total|Net Amount)[:\s]*(?:₹|Rs\.?)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/i);
//   if (totalMatch) {
//     amount = parseFloat(totalMatch[1].replace(/,/g, ''));
//   } else {
//     const allAmounts = text.match(/(?:₹|Rs\.?)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi);
//     if (allAmounts && allAmounts.length > 0) {
//       const lastAmount = allAmounts[allAmounts.length - 1];
//       const amountValue = lastAmount.match(/\d+(?:,\d+)*(?:\.\d{1,2})?/);
//       if (amountValue) amount = parseFloat(amountValue[0].replace(/,/g, ''));
//     }
//   }
//   const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/);
//   const date = dateMatch ? dateMatch[1] : undefined;
//   const lines = text.split('\n').filter(l => l.trim());
//   const vendor = lines[0]?.trim();
//   return { text, amount, date, vendor };
// };
