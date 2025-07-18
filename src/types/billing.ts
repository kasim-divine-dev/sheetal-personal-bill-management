
export type BillingCategory = 'sweets' | 'khajur-chocolate' | 'cakes-bakery';

export interface BillingRecord {
  id: string;
  date: string;
  billNos: string;
  category: BillingCategory;
  grossAmount: number;
  cgst: number;
  sgst: number;
  totalBillAmount: number;
  onlineSales?: number; // Optional for cakes & bakery
  cashSales?: number; // Optional for cakes & bakery
  khajurAmount?: number; // Only for khajur & chocolate
  chocolateAmount?: number; // Only for khajur & chocolate
  totalAmount: number;
}

export interface CategoryConfig {
  name: string;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  hasCashOnlineSplit: boolean;
  hasKhajurChocolateSplit: boolean;
}

export interface DashboardWidget {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface FilterOptions {
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  singleDate?: Date | null;
  preset?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth';
  category?: BillingCategory;
}
