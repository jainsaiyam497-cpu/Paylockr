import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction, Expense } from "../types";

const callGroqAPI = async (prompt: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
};

const getAiInstance = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API Key missing. Please add VITE_GEMINI_API_KEY to your .env.local file in the project root.");
  }
  return new GoogleGenerativeAI(apiKey);
};

export const generateTaxInsights = async (transactions: Transaction[], annualIncome: number) => {
  try {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!groqKey && !geminiKey) {
      return `📊 Tax Analysis (Demo Mode):\n\n✅ Your annual income of ₹${annualIncome.toLocaleString('en-IN')} puts you in a moderate tax bracket.\n\n💡 Recommendations:\n• Set aside 20-25% for taxes\n• Maximize Section 80C deductions (₹1.5L)\n• Consider health insurance under 80D\n• Pay advance tax quarterly to avoid penalties\n\n⚠️ Add VITE_GROQ_API_KEY to .env.local for AI-powered insights.`;
    }
    
    const transactionSummary = transactions
      .slice(0, 10)
      .map(t => {
        const dateStr = t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date;
        return `${dateStr}: ${t.source} - ₹${t.amount} (${t.type})`;
      })
      .join('\n');

    const prompt = `As a tax expert for Indian freelancers, analyze this recent transaction data and annual income context.
      
Annual Estimated Income: ₹${annualIncome}
Recent Transactions:
${transactionSummary}

Provide a concise summary of:
1. Potential tax saving opportunities based on sources.
2. Risk of jumping to a higher tax slab.
3. A recommendation for estimated tax percentage to set aside.

Keep it professional, fintech style, and under 150 words total.`;

    if (groqKey) {
      return await callGroqAPI(prompt);
    } else {
      const genAI = getAiInstance();
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text() || "No insights could be generated.";
    }
  } catch (error: any) {
    console.error("❌ Tax Insights Error:", error);
    return `📊 Tax Analysis:\n\n✅ Your annual income of ₹${annualIncome.toLocaleString('en-IN')} puts you in a moderate tax bracket.\n\n💡 Recommendations:\n• Set aside 20-25% for taxes\n• Maximize Section 80C deductions (₹1.5L)\n• Consider health insurance under 80D\n• Pay advance tax quarterly to avoid penalties`;
  }
};

// NEW: Expense Analysis
export const analyzeExpenses = async (expenses: Expense[], totalIncome: number) => {
  try {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!groqKey && !geminiKey) {
      const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
      return `📈 Expense Analysis (Demo Mode):\n\n💰 Total Expenses: ₹${totalExpense.toLocaleString('en-IN')}\n\n🎯 Optimization Tips:\n• Review recurring subscriptions\n• Track business vs personal expenses\n• Claim eligible business deductions\n• Maintain proper receipts for tax filing\n\n⚠️ Add VITE_GROQ_API_KEY to .env.local for AI analysis.`;
    }
    
    const expenseByCategory = expenses.reduce((acc: any, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    
    const categorySummary = Object.entries(expenseByCategory)
      .map(([cat, amt]) => `${cat}: ₹${amt}`)
      .join(', ');

    const prompt = `Analyze these monthly expenses for an Indian freelancer:
Total Income: ₹${totalIncome}
Expenses by Category: ${categorySummary}

Provide:
1. Top 2 categories to optimize
2. Potential business deductions
3. One actionable tip to reduce expenses

Keep it under 100 words, actionable and specific.`;

    if (groqKey) {
      return await callGroqAPI(prompt);
    } else {
      const genAI = getAiInstance();
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error: any) {
    console.error("Expense Analysis Error:", error);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    return `📈 Expense Analysis:\n\n💰 Total Expenses: ₹${totalExpense.toLocaleString('en-IN')}\n\n🎯 Optimization Tips:\n• Review recurring subscriptions\n• Track business vs personal expenses\n• Claim eligible business deductions\n• Maintain proper receipts for tax filing`;
  }
};

// NEW: Tax Saving Recommendations
export const getTaxSavingTips = async (income: number, currentTaxSlab: number) => {
  try {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!groqKey && !geminiKey) {
      return `💡 Tax-Saving Strategies (Demo Mode):\n\n1️⃣ Section 80C (₹1.5L limit):\n   • PPF, ELSS, Life Insurance\n   • Estimated savings: ₹46,800\n\n2️⃣ Section 80D (₹25K-50K):\n   • Health insurance premiums\n   • Estimated savings: ₹7,800\n\n3️⃣ Business Expenses:\n   • Internet, phone, software\n   • Home office deduction\n\n⚠️ Add VITE_GROQ_API_KEY to .env.local for personalized strategies.`;
    }

    const prompt = `For an Indian freelancer with:
- Annual Income: ₹${income}
- Current Tax Slab: ${currentTaxSlab}%

Suggest 3 specific tax-saving strategies under Indian tax law (80C, 80D, etc.).
Include estimated savings amount for each.
Keep it under 120 words, practical and legal.`;

    if (groqKey) {
      return await callGroqAPI(prompt);
    } else {
      const genAI = getAiInstance();
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error: any) {
    console.error("Tax Tips Error:", error);
    return `💡 Tax-Saving Strategies:\n\n1️⃣ Section 80C (₹1.5L limit):\n   • PPF, ELSS, Life Insurance\n   • Estimated savings: ₹46,800\n\n2️⃣ Section 80D (₹25K-50K):\n   • Health insurance premiums\n   • Estimated savings: ₹7,800\n\n3️⃣ Business Expenses:\n   • Internet, phone, software\n   • Home office deduction`;
  }
};

// NEW: Financial Health Score
export const calculateFinancialHealth = async (data: {
  income: number;
  expenses: number;
  vaultBalance: number;
  taxLiability: number;
}) => {
  try {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!groqKey && !geminiKey) {
      const savingsRate = ((data.income - data.expenses) / data.income * 100).toFixed(0);
      const vaultCoverage = ((data.vaultBalance / data.taxLiability) * 100).toFixed(0);
      const score = Math.min(100, Math.round((parseFloat(savingsRate) + parseFloat(vaultCoverage)) / 2));
      return `🛡️ Financial Health (Demo Mode):\n\nScore: ${score}/100\nStatus: ${score > 70 ? 'Good' : score > 40 ? 'Fair' : 'Needs Attention'}\n\n📊 Metrics:\n• Savings Rate: ${savingsRate}%\n• Tax Coverage: ${vaultCoverage}%\n\n🎯 Priority: ${score < 50 ? 'Increase tax vault contributions' : 'Maintain current savings'}\n\n⚠️ Add VITE_GROQ_API_KEY to .env.local for detailed analysis.`;
    }

    const prompt = `Calculate financial health score (0-100) for:
- Monthly Income: ₹${data.income}
- Monthly Expenses: ₹${data.expenses}
- Tax Vault: ₹${data.vaultBalance}
- Tax Liability: ₹${data.taxLiability}

Provide:
1. Score out of 100
2. One-line assessment
3. Top priority action

Format: "Score: X/100 | Status | Action"
Keep under 80 words.`;

    if (groqKey) {
      return await callGroqAPI(prompt);
    } else {
      const genAI = getAiInstance();
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error: any) {
    console.error("Health Check Error:", error);
    const savingsRate = ((data.income - data.expenses) / data.income * 100).toFixed(0);
    const vaultCoverage = ((data.vaultBalance / data.taxLiability) * 100).toFixed(0);
    const score = Math.min(100, Math.round((parseFloat(savingsRate) + parseFloat(vaultCoverage)) / 2));
    return `🛡️ Financial Health:\n\nScore: ${score}/100\nStatus: ${score > 70 ? 'Good' : score > 40 ? 'Fair' : 'Needs Attention'}\n\n📊 Metrics:\n• Savings Rate: ${savingsRate}%\n• Tax Coverage: ${vaultCoverage}%\n\n🎯 Priority: ${score < 50 ? 'Increase tax vault contributions' : 'Maintain current savings'}`;
  }
};