
import { useState, useEffect, useMemo } from 'react';
import { BillingRecord, FilterOptions, BillingCategory } from '@/types/billing';
import { calculateBillingFields } from '@/utils/billingCalculations';

// Sample data for demonstration
const generateSampleData = (): BillingRecord[] => {
  const sampleData: BillingRecord[] = [];
  const today = new Date();
  const categories: BillingCategory[] = ['sweets', 'khajur-chocolate', 'cakes-bakery'];
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const totalAmount = Math.floor(Math.random() * 200000) + 10000;
    
    const calculated = calculateBillingFields(totalAmount, category);
    
    sampleData.push({
      id: `bill-${i + 1}`,
      date: date.toISOString().split('T')[0],
      billNos: `${3000 + i * 10}-${3000 + i * 10 + 9}`,
      category,
      grossAmount: calculated.grossAmount || 0,
      cgst: calculated.cgst || 0,
      sgst: calculated.sgst || 0,
      totalBillAmount: calculated.totalBillAmount || 0,
      onlineSales: calculated.onlineSales,
      cashSales: calculated.cashSales,
      khajurAmount: calculated.khajurAmount,
      chocolateAmount: calculated.chocolateAmount,
      totalAmount
    });
  }
  
  return sampleData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useBillingData = () => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BillingRecord[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const sampleData = generateSampleData();
      setBillingRecords(sampleData);
      setFilteredRecords(sampleData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...billingRecords];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(record => record.category === filters.category);
    }

    // Apply date filters
    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        const fromDate = filters.dateRange!.from!;
        const toDate = filters.dateRange!.to!;
        return recordDate >= fromDate && recordDate <= toDate;
      });
    }

    if (filters.singleDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        const filterDate = filters.singleDate!;
        return recordDate.toDateString() === filterDate.toDateString();
      });
    }

    // Apply preset filters
    if (filters.preset) {
      const now = new Date();
      let startDate: Date;

      switch (filters.preset) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          filtered = filtered.filter(record => new Date(record.date) >= startDate);
          break;
        case 'yesterday':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          filtered = filtered.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= startDate && recordDate < endDate;
          });
          break;
        case 'last7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(record => new Date(record.date) >= startDate);
          break;
        case 'last30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(record => new Date(record.date) >= startDate);
          break;
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(record => new Date(record.date) >= startDate);
          break;
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          filtered = filtered.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= startDate && recordDate <= lastMonthEnd;
          });
          break;
      }
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        Object.values(record).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredRecords(filtered);
  }, [billingRecords, filters, searchTerm]);

  const dashboardData = useMemo(() => {
    const totalEntries = filteredRecords.length;
    const totalSales = filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0);
    
    const now = new Date();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisWeekSales = billingRecords
      .filter(record => new Date(record.date) >= startOfWeek)
      .reduce((sum, record) => sum + record.totalAmount, 0);
    
    const thisMonthSales = billingRecords
      .filter(record => new Date(record.date) >= startOfMonth)
      .reduce((sum, record) => sum + record.totalAmount, 0);

    // Category-wise breakdown
    const sweetsTotal = filteredRecords
      .filter(record => record.category === 'sweets')
      .reduce((sum, record) => sum + record.totalAmount, 0);
      
    const khajurChocolateTotal = filteredRecords
      .filter(record => record.category === 'khajur-chocolate')
      .reduce((sum, record) => sum + record.totalAmount, 0);
      
    const cakesBakeryTotal = filteredRecords
      .filter(record => record.category === 'cakes-bakery')
      .reduce((sum, record) => sum + record.totalAmount, 0);

    return {
      totalEntries,
      totalSales,
      thisWeekSales,
      thisMonthSales,
      sweetsTotal,
      khajurChocolateTotal,
      cakesBakeryTotal
    };
  }, [filteredRecords, billingRecords]);

  const addBillingRecord = (record: Omit<BillingRecord, 'id'>) => {
    const newRecord: BillingRecord = {
      ...record,
      id: `bill-${Date.now()}`
    };
    setBillingRecords(prev => [newRecord, ...prev]);
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return {
    billingRecords: filteredRecords,
    dashboardData,
    filters,
    searchTerm,
    isLoading,
    addBillingRecord,
    updateFilters,
    clearFilters,
    setSearchTerm
  };
};
