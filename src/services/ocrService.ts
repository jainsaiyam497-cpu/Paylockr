import Tesseract from 'tesseract.js';

export const scanInvoice = async (imageFile: File): Promise<{
  text: string;
  amount?: number;
  date?: string;
  vendor?: string;
}> => {
  try {
    const result = await Tesseract.recognize(imageFile, 'eng', {
      logger: (m) => console.log(m)
    });

    const text = result.data.text;
    
    // Extract amount - prioritize TOTAL/Total Fare lines
    let amount: number | undefined;
    
    // First try to find amount after TOTAL/Total keywords
    const totalMatch = text.match(/(?:TOTAL|Total|total|Grand Total|Net Amount)[:\s]*(?:₹|Rs\.?)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/i);
    if (totalMatch) {
      amount = parseFloat(totalMatch[1].replace(/,/g, ''));
    } else {
      // Fallback: find last amount in text (usually the total)
      const allAmounts = text.match(/(?:₹|Rs\.?)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi);
      if (allAmounts && allAmounts.length > 0) {
        const lastAmount = allAmounts[allAmounts.length - 1];
        const amountValue = lastAmount.match(/\d+(?:,\d+)*(?:\.\d{1,2})?/);
        if (amountValue) {
          amount = parseFloat(amountValue[0].replace(/,/g, ''));
        }
      }
    }

    // Extract date (DD/MM/YYYY or DD-MM-YYYY)
    const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/);
    const date = dateMatch ? dateMatch[1] : undefined;

    // Extract vendor/company name (first line usually)
    const lines = text.split('\n').filter(l => l.trim());
    const vendor = lines[0]?.trim();

    return { text, amount, date, vendor };
  } catch (error) {
    console.error('OCR failed:', error);
    throw new Error('Failed to scan document');
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
  const scanned = await scanInvoice(imageFile);
  
  // Auto-categorize based on keywords
  const text = scanned.text.toLowerCase();
  let category = 'Other';
  
  if (text.includes('food') || text.includes('restaurant') || text.includes('cafe')) {
    category = 'Food & Dining';
  } else if (text.includes('uber') || text.includes('ola') || text.includes('transport')) {
    category = 'Transportation';
  } else if (text.includes('software') || text.includes('subscription') || text.includes('saas')) {
    category = 'Software & Tools';
  } else if (text.includes('office') || text.includes('supplies')) {
    category = 'Office Supplies';
  }

  return {
    category,
    amount: scanned.amount || 0,
    date: scanned.date || new Date().toLocaleDateString('en-IN'),
    description: scanned.vendor || 'Scanned expense'
  };
};
