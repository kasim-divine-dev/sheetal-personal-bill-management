import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/billingCalculations';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  value,
  icon,
  trend,
  prefix = ''
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return prefix === '₹' ? formatCurrency(val) : val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className="bg-card border-border hover:shadow-card transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-accent">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-2">
          {formatValue(value)}
        </div>
        {trend && (
          <div className="flex items-center space-x-2">
            <Badge 
              variant={trend.isPositive ? "default" : "destructive"}
              className="flex items-center space-x-1"
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              vs last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};