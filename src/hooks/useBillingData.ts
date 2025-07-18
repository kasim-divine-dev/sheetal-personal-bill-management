
import { useState, useEffect, useMemo } from 'react';
import { BillingRecord, FilterOptions, BillingCategory } from '@/types/billing';
import { calculateBillingFields } from '@/utils/billingCalculations';

// Sample data for demonstration
const generateSampleData = (): Record<BillingCategory, BillingRecord[]> => {
  const categories: BillingCategory[] = ['sweets', 'khajur-chocolate', 'cakes-bakery'];
  const categoryData: Record<BillingCategory, BillingRecord[]> = {
    'sweets': [],
    'khajur-chocolate': [],
    'cakes-bakery': []
  };
  
  const today = new Date();
  
  categories.forEach(category => {
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      const totalAmount = Math.floor(Math.random() * 200000) + 10000;
      const calculated = calculateBillingFields(totalAmount, category);
      
      categoryData[category].push({
        id: `${category}-bill-${i + 1}`,
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
    
    // Sort by date descending
    categoryData[category].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  
  return categoryData;
};

export const useBillingData = () => {
  const [billingData, setBillingData] = useState<Record<BillingCategory, BillingRecord[]>>({
    'sweets': [],
    'khajur-chocolate': [],
    'cakes-bakery': []
  });
  const [filteredData, setFilteredData] = useState<Record<BillingCategory, BillingRecord[]>>({
    'sweets': [],
    'khajur-chocolate': [],
    'cakes-bakery': []
  });
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const sampleData = generateSampleData();
      setBillingData(sampleData);
      setFilteredData(sampleData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters to each category
  useEffect(() => {
    const categories: BillingCategory[] = ['sweets', 'khajur-chocolate', 'cakes-bakery'];
    const newFilteredData: Record<BillingCategory, BillingRecord[]> = {
      'sweets': [],
      'khajur-chocolate': [],
      'cakes-bakery': []
    };

    categories.forEach(category => {
      let filtered = [...billingData[category]];

      // Apply category filter
      if (filters.category && filters.category !== category) {
        filtered = [];
      } else {
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
      }

      newFilteredData[category] = filtered;
    });

    setFilteredData(newFilteredData);
  }, [billingData, filters, searchTerm]);

  // Get all records combined for dashboard calculations
  const allRecords = useMemo(() => {
    const categories: BillingCategory[] = ['sweets', 'khajur-chocolate', 'cakes-bakery'];
    return categories.flatMap(category => filteredData[category]);
  }, [filteredData]);

  const dashboardData = useMemo(() => {
    const totalEntries = allRecords.length;
    const totalSales = allRecords.reduce((sum, record) => sum + record.totalAmount, 0);
    
    const now = new Date();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const allBillingRecords = Object.values(billingData).flat();
    
    const thisWeekSales = allBillingRecords
      .filter(record => new Date(record.date) >= startOfWeek)
      .reduce((sum, record) => sum + record.totalAmount, 0);
    
    const thisMonthSales = allBillingRecords
      .filter(record => new Date(record.date) >= startOfMonth)
      .reduce((sum, record) => sum + record.totalAmount, 0);

    // Category-wise breakdown
    const sweetsTotal = filteredData.sweets
      .reduce((sum, record) => sum + record.totalAmount, 0);
      
    const khajurChocolateTotal = filteredData['khajur-chocolate']
      .reduce((sum, record) => sum + record.totalAmount, 0);
      
    const cakesBakeryTotal = filteredData['cakes-bakery']
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
  }, [allRecords, billingData, filteredData]);

  const addBillingRecord = (record: Omit<BillingRecord, 'id'>) => {
    const newRecord: BillingRecord = {
      ...record,
      id: `${record.category}-bill-${Date.now()}`
    };
    
    setBillingData(prev => ({
      ...prev,
      [record.category]: [newRecord, ...prev[record.category]]
    }));
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getBillingRecordsByCategory = (category: BillingCategory) => {
    return filteredData[category];
  };

  return {
    billingRecords: allRecords, // For backward compatibility
    billingData: filteredData,
    dashboardData,
    filters,
    searchTerm,
    isLoading,
    addBillingRecord,
    updateFilters,
    clearFilters,
    setSearchTerm,
    getBillingRecordsByCategory
  };
};
