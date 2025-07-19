import { useBillingData } from '@/hooks/useBillingData';
import {
  Calendar,
  DollarSign,
  FileText,
  TrendingUp
} from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';

export const Dashboard: React.FC = () => {
  const { dashboardData } = useBillingData();

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
    <div className="lg:col-span-3 grid grid-cols-1 gap-3">
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
  );
};