import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction } from "../types";

// Helper to get AI instance safely for Vite/Browser environment
const getAiInstance = () => {
  // Check import.meta.env first (Vite standard)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  console.log('🔑 API Key Check:', apiKey ? `Found (${apiKey.substring(0, 10)}...)` : 'MISSING');
  
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API Key missing. Please add VITE_GEMINI_API_KEY to your .env.local file in the project root.");
  }
  return new GoogleGenerativeAI(apiKey);
};

export const generateTaxInsights = async (transactions: Transaction[], annualIncome: number) => {
  try {
    const genAI = getAiInstance();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const transactionSummary = transactions
      .slice(0, 10) // Limit to recent transactions to avoid token limits
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "No insights could be generated.";
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    });
    if (error.message?.includes('API Key missing')) {
      throw error;
    }
    throw new Error("AI Insights currently unavailable. Please check your API key or internet connection.");
  }
};