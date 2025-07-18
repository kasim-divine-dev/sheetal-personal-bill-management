import { BillingRecord } from '@/types/billing';

export const calculateBillingFields = (totalAmount: number): Partial<BillingRecord> => {
  // Gross Amount = Total Amount / 1.05 (removing 5% tax)
  const grossAmount = totalAmount / 1.05;
  
  // CGST = Gross Amount × 0.025
  const cgst = grossAmount * 0.025;
  
  // SGST = Gross Amount × 0.025
  const sgst = grossAmount * 0.025;
  
  // Total Bill Amount = Gross Amount + CGST + SGST
  const totalBillAmount = grossAmount + cgst + sgst;
  
  // Cash/Online Sales Distribution Logic
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
  
  return {
    grossAmount: Math.round(grossAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    totalBillAmount: Math.round(totalBillAmount * 100) / 100,
    cashSales,
    onlineSales,
    totalAmount
  };
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