import { DashboardWidget } from './DashboardWidget';
import { FilterPanel } from './FilterPanel';
import { useBillingData } from '@/hooks/useBillingData';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  BarChart3
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { dashboardData, filters, updateFilters } = useBillingData();

  const widgets = [
    {
      title: 'Total Entries',
      value: dashboardData.totalEntries,
      icon: <FileText className="h-4 w-4" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Total Sales',
      value: dashboardData.totalSales,
      icon: <DollarSign className="h-4 w-4" />,
      prefix: '₹',
      trend: { value: 8.5, isPositive: true }
    },
    {
      title: 'This Week Sales',
      value: dashboardData.thisWeekSales,
      icon: <Calendar className="h-4 w-4" />,
      prefix: '₹',
      trend: { value: 3.2, isPositive: false }
    },
    {
      title: 'This Month Sales',
      value: dashboardData.thisMonthSales,
      icon: <TrendingUp className="h-4 w-4" />,
      prefix: '₹',
      trend: { value: 15.7, isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your billing management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-accent" />
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {widgets.map((widget, index) => (
          <DashboardWidget
            key={index}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            prefix={widget.prefix}
            trend={widget.trend}
          />
        ))}
      </div>
    </div>
  );
};