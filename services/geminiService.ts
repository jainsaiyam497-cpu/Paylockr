import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../src/types";

// Helper to get AI instance safely
const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTaxInsights = async (transactions: Transaction[], annualIncome: number) => {
  try {
    const ai = getAiInstance();
    const model = "gemini-3-flash-preview";
    
    const transactionSummary = transactions
      .slice(0, 10) // Limit to recent transactions to avoid token limits in demo
      .map(t => `${t.date}: ${t.source} - ₹${t.amount} (${t.type})`)
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