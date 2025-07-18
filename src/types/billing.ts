export interface BillingRecord {
  id: string;
  date: string;
  billNos: string;
  grossAmount: number;
  cgst: number;
  sgst: number;
  totalBillAmount: number;
  onlineSales: number;
  cashSales: number;
  totalAmount: number;
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
}