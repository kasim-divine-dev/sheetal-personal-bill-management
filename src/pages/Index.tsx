
import { useState } from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { SweetsForm } from '@/components/forms/SweetsForm';
import { KhajurChocolateForm } from '@/components/forms/KhajurChocolateForm';
import { CakesBakeryForm } from '@/components/forms/CakesBakeryForm';
import { BillingTable } from '@/components/table/BillingTable';
import { useBillingData } from '@/hooks/useBillingData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Table, Candy, Coffee, Cake } from 'lucide-react';

const Index = () => {
  const { 
    billingRecords, 
    searchTerm, 
    setSearchTerm, 
    addBillingRecord, 
    isLoading 
  } = useBillingData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-accent" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Multi-Category Billing Management System
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive billing records for Sweets, Khajur & Chocolate, and Cakes & Bakery
                </p>
              </div>
            </div>
            
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="sweets" className="flex items-center space-x-2">
                <Candy className="h-4 w-4" />
                <span className="hidden sm:inline">Sweets</span>
              </TabsTrigger>
              <TabsTrigger value="khajur-chocolate" className="flex items-center space-x-2">
                <Coffee className="h-4 w-4" />
                <span className="hidden sm:inline">Khajur</span>
              </TabsTrigger>
              <TabsTrigger value="cakes-bakery" className="flex items-center space-x-2">
                <Cake className="h-4 w-4" />
                <span className="hidden sm:inline">Cakes</span>
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center space-x-2">
                <Table className="h-4 w-4" />
                <span className="hidden sm:inline">View All</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="sweets" className="space-y-6">
            <SweetsForm onSubmit={addBillingRecord} />
          </TabsContent>

          <TabsContent value="khajur-chocolate" className="space-y-6">
            <KhajurChocolateForm onSubmit={addBillingRecord} />
          </TabsContent>

          <TabsContent value="cakes-bakery" className="space-y-6">
            <CakesBakeryForm onSubmit={addBillingRecord} />
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <BillingTable 
              records={billingRecords}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
