// Mock bank statement extraction - works without API keys
export const mockExtractTransactions = (file) => {
  console.log(`[MockExtractor] Processing ${file.name}`);
  
  // Simulate realistic bank transactions
  const mockTransactions = [
    {
      date: "2024-12-15",
      description: "UPI/DR/978584154770/INDSTOCKS/HDFC0000240/Investment",
      upi_ref: "978584154770",
      source: "INDSTOCKS",
      amount: 5000,
      type: "debit",
      balance: 45000
    },
    {
      date: "2024-12-14", 
      description: "UPI/CR/123456789012/CLIENT PAYMENT/UPWORK/Freelance",
      upi_ref: "123456789012",
      source: "UPWORK",
      amount: 25000,
      type: "credit",
      balance: 50000
    },
    {
      date: "2024-12-13",
      description: "UPI/DR/456789123456/SWIGGY/Food Order",
      upi_ref: "456789123456", 
      source: "SWIGGY",
      amount: 450,
      type: "debit",
      balance: 25000
    },
    {
      date: "2024-12-12",
      description: "NEFT/CR/SALARY/TECHFLOW SOLUTIONS/Monthly Payment",
      upi_ref: null,
      source: "TECHFLOW SOLUTIONS",
      amount: 75000,
      type: "credit",
      balance: 25450
    },
    {
      date: "2024-12-11",
      description: "UPI/DR/789123456789/NETFLIX/Subscription",
      upi_ref: "789123456789",
      source: "NETFLIX", 
      amount: 649,
      type: "debit",
      balance: -49550
    }
  ];
  
  return {
    transactions: mockTransactions,
    confidence: 0.95,
    source: 'mock-extractor'
  };
};