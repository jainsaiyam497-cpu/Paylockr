import { TaxSettings } from '../types';

/**
 * Tax Service
 * Handles tax calculations based on Indian tax regimes.
 */

export const taxService = {
  /**
   * Calculate provisional tax based on income and regime
   */
  calculateTax: (annualIncome: number, settings: TaxSettings): number => {
    let taxableIncome = annualIncome;

    if (settings.regime === 'Old') {
      // Apply Standard Deduction
      taxableIncome -= 50000;

      // Apply 80C
      if (settings.deductions80C) {
        taxableIncome -= Math.min(150000, settings.annualDeductionAmount); // Cap at 1.5L
      }
      
      // Apply 80D (Health Insurance) - Simplified max cap
      if (settings.deductions80D) {
        taxableIncome -= 25000; 
      }
    } else {
      // New Regime (FY 2023-24 onwards)
      // Standard deduction allowed in new regime now
      taxableIncome -= 75000;
    }

    if (taxableIncome <= 0) return 0;

    let tax = 0;

    if (settings.regime === 'New') {
      // New Regime Slabs (FY 2024-25 proposed)
      // 0-3L: Nil
      // 3-7L: 5%
      // 7-10L: 10%
      // 10-12L: 15%
      // 12-15L: 20%
      // >15L: 30%
      
      if (taxableIncome > 300000) {
        if (taxableIncome <= 700000) {
           // Rebate u/s 87A applies if income <= 7L, tax is effectively 0
           return 0; 
        }
        
        // Calculation for income > 7L
        const slabs = [
          { limit: 300000, rate: 0 },
          { limit: 700000, rate: 0.05 },
          { limit: 1000000, rate: 0.10 },
          { limit: 1200000, rate: 0.15 },
          { limit: 1500000, rate: 0.20 },
          { limit: Infinity, rate: 0.30 }
        ];

        let remainingIncome = taxableIncome;
        let previousLimit = 0;

        for (const slab of slabs) {
          if (remainingIncome <= 0) break;
          
          const taxableAtThisSlab = Math.min(remainingIncome, slab.limit - previousLimit);
          
          if (previousLimit >= 300000) { // Tax applies above 3L
             // Note: Detailed calculation logic simplified for prototype
          }
          
          previousLimit = slab.limit;
        }
        
        // Simplified Flat Rate estimation for prototype speed
        // Effective rate approximation
        if (taxableIncome < 900000) tax = taxableIncome * 0.05;
        else if (taxableIncome < 1200000) tax = taxableIncome * 0.10;
        else if (taxableIncome < 1500000) tax = taxableIncome * 0.15;
        else tax = taxableIncome * 0.25;
      }
    } else {
      // Old Regime Slabs
      // 0-2.5L: Nil
      // 2.5-5L: 5%
      // 5-10L: 20%
      // >10L: 30%
      if (taxableIncome > 500000) { // Rebate u/s 87A limit 5L
         if (taxableIncome > 1000000) {
           tax = 112500 + (taxableIncome - 1000000) * 0.30;
         } else if (taxableIncome > 500000) {
           tax = 12500 + (taxableIncome - 500000) * 0.20;
         }
      }
    }

    // Add Cess (4%)
    tax = tax * 1.04;

    return Math.round(tax);
  },

  /**
   * Get Standard Deduction
   */
  getStandardDeduction: (regime: 'Old' | 'New'): number => {
    return regime === 'New' ? 75000 : 50000;
  }
};
