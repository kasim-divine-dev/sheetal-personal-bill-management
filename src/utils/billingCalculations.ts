
import { BillingRecord, BillingCategory, CategoryConfig } from '@/types/billing';

export const categoryConfigs: Record<BillingCategory, CategoryConfig> = {
  'sweets': {
    name: 'Sweets',
    gstRate: 5,
    cgstRate: 2.5,
    sgstRate: 2.5,
    hasCashOnlineSplit: true,
    hasKhajurChocolateSplit: false
  },
  'khajur-chocolate': {
    name: 'Khajur & Chocolate',
    gstRate: 12,
    cgstRate: 6,
    sgstRate: 6,
    hasCashOnlineSplit: false,
    hasKhajurChocolateSplit: true
  },
  'cakes-bakery': {
    name: 'Cakes & Bakery',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    hasCashOnlineSplit: false,
    hasKhajurChocolateSplit: false
  }
};

export const calculateBillingFields = (
  totalAmount: number, 
  category: BillingCategory
): Partial<BillingRecord> => {
  const config = categoryConfigs[category];
  const gstMultiplier = 1 + (config.gstRate / 100);
  
  // Gross Amount = Total Amount / (1 + GST%)
  const grossAmount = totalAmount / gstMultiplier;
  
  // CGST & SGST calculations
  const cgst = grossAmount * (config.cgstRate / 100);
  const sgst = grossAmount * (config.sgstRate / 100);
  
  // Total Bill Amount = Gross Amount + CGST + SGST
  const totalBillAmount = grossAmount + cgst + sgst;
  
  const result: Partial<BillingRecord> = {
    category,
    grossAmount: Math.round(grossAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    totalBillAmount: Math.round(totalBillAmount * 100) / 100,
    totalAmount
  };

  // Handle Sweets - Cash/Online distribution
  if (category === 'sweets') {
    let cashPercentage: number;
    
    if (totalAmount <= 50000) {
      cashPercentage = Math.random() * (5 - 3) + 3; // 3-5%
    } else if (totalAmount <= 100000) {
      cashPercentage = Math.random() * (9 - 6) + 6; // 6-9%
    } else if (totalAmount <= 150000) {
      cashPercentage = Math.random() * (12 - 9) + 9; // 9-12%
    } else {
      cashPercentage = Math.random() * (15 - 12) + 12; // 12-15%
    }
    
    const cashSales = Math.round(totalAmount * (cashPercentage / 100));
    const onlineSales = totalAmount - cashSales;
    
    result.cashSales = cashSales;
    result.onlineSales = onlineSales;
  }

  // Handle Khajur & Chocolate - Random split
  if (category === 'khajur-chocolate') {
    const chocolatePercentages = [10, 20, 35];
    const randomPercentage = chocolatePercentages[Math.floor(Math.random() * chocolatePercentages.length)];
    
    const chocolateAmount = Math.round(totalAmount * (randomPercentage / 100));
    const khajurAmount = totalAmount - chocolateAmount;
    
    result.chocolateAmount = chocolateAmount;
    result.khajurAmount = khajurAmount;
  }

  return result;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const generateBillNumber = (startRange: number, endRange: number): string => {
  return `${startRange}-${endRange}`;
};

export const getCategoryDisplayName = (category: BillingCategory): string => {
  return categoryConfigs[category].name;
};
