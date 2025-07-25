
import { useState } from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { UnifiedBillingForm } from '@/components/forms/UnifiedBillingForm';
import { BillingTable } from '@/components/table/BillingTable';
import { useBillingData } from '@/hooks/useBillingData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BarChart3, Table, Plus, Candy, Coffee, Cake } from 'lucide-react';
import { BillingCategory } from '@/types/billing';
import { FilterPanel } from '@/components/dashboard/FilterPanel';

const Index = () => {
  const {
    billingData,
    searchTerm,
    setSearchTerm,
    addBillingRecord,
    isLoading,
    getBillingRecordsByCategory, filters, updateFilters
  } = useBillingData();

  const [selectedTableCategory, setSelectedTableCategory] = useState<BillingCategory>('sweets');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48 sm:w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4 sm:p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </Card>
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const categoryOptions = [
    { value: 'sweets' as BillingCategory, label: 'Sweets', icon: Candy, color: 'text-green-500' },
    { value: 'khajur-chocolate' as BillingCategory, label: 'Khajur & Chocolate', icon: Coffee, color: 'text-orange-500' },
    { value: 'cakes-bakery' as BillingCategory, label: 'Cakes & Bakery', icon: Cake, color: 'text-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className=" p-4 sm:p-6 space-y-5">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-4">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-accent flex-shrink-0" />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                Billing Management
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage billing records for Sweets, Khajur & Chocolate, and Cakes & Bakery
              </p>
            </div>
          </div>
          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFiltersChange={updateFilters}
          />
        </div>
        <div className='grid grid-cols-12 gap-4'>
          <Dashboard />
          <UnifiedBillingForm onSubmit={addBillingRecord} />
        </div>

        <Card className="bg-card border-border">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Billing Records</h2>
                <p className="text-sm text-muted-foreground">View and manage category-specific records</p>
              </div>

              <div className="w-full sm:w-64">
                <Label htmlFor="table-category" className="text-sm font-medium">
                  Select Category
                </Label>
                <Select
                  value={selectedTableCategory}
                  onValueChange={(value) => setSelectedTableCategory(value as BillingCategory)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className={`h-4 w-4 ${option.color}`} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
        <BillingTable
          records={getBillingRecordsByCategory(selectedTableCategory)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={selectedTableCategory}
        />
      </div>
    </div>
  );
};

export default Index;
