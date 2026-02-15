import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../src/types";

// Helper to get AI instance safely for Vite/Browser environment
const getAiInstance = () => {
  // Check import.meta.env first (Vite standard), fall back to empty string
  const apiKey = (import.meta as any).env.VITE_API_KEY || (import.meta as any).env.API_KEY || '';
  
  if (!apiKey) {
    throw new Error("API Key missing. Please add VITE_API_KEY to your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTaxInsights = async (transactions: Transaction[], annualIncome: number) => {
  try {
    const ai = getAiInstance();
    const model = "gemini-3-flash-preview";
    
    const transactionSummary = transactions
      .slice(0, 10) // Limit to recent transactions to avoid token limits in demo
      .map(t => {
        // Handle date string or object safely
        const dateStr = t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date;
        return `${dateStr}: ${t.source} - ₹${t.amount} (${t.type})`;
      })
      .join('\n');

    const prompt = `
      As a tax expert for Indian freelancers, analyze this recent transaction data and annual income context.
      
      Annual Estimated Income: ₹${annualIncome}
      Recent Transactions:
      ${transactionSummary}

      Provide a concise summary of:
      1. Potential tax saving opportunities based on sources.
      2. Risk of jumping to a higher tax slab.
      3. A recommendation for estimated tax percentage to set aside.

      Keep it professional, fintech style, and under 150 words total.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No insights could be generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Insights currently unavailable. Please check your API key or internet connection.";
  }
};