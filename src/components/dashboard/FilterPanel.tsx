import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FilterOptions } from '@/types/billing';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const presetOptions = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'last7days', label: 'Last 7 days' },
    { key: 'last30days', label: 'Last 30 days' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'lastMonth', label: 'Last Month' }
  ] as const;

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {};
    setTempFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const handlePresetSelect = (preset: FilterOptions['preset']) => {
    setTempFilters({
      ...tempFilters,
      preset,
      dateRange: undefined,
      singleDate: undefined
    });
  };

  const activeFiltersCount = Object.keys(filters).filter(key =>
    filters[key as keyof FilterOptions] !== undefined &&
    filters[key as keyof FilterOptions] !== null
  ).length;

  return (
    <Card className="bg-card border-border lg:w-64 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-accent" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Hide' : 'Show'} Filters
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-6">
          {/* Preset Filters */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              {presetOptions.map(({ key, label }) => (
                <Button
                  key={key}
                  variant={tempFilters.preset === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetSelect(key)}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Date Range</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !tempFilters.dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempFilters.dateRange?.from ? (
                      format(tempFilters.dateRange.from, "PPP")
                    ) : (
                      <span>From date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempFilters.dateRange?.from || undefined}
                    onSelect={(date) => setTempFilters({
                      ...tempFilters,
                      dateRange: { ...tempFilters.dateRange, from: date || null, to: tempFilters.dateRange?.to || null },
                      preset: undefined,
                      singleDate: undefined
                    })}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !tempFilters.dateRange?.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempFilters.dateRange?.to ? (
                      format(tempFilters.dateRange.to, "PPP")
                    ) : (
                      <span>To date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempFilters.dateRange?.to || undefined}
                    onSelect={(date) => setTempFilters({
                      ...tempFilters,
                      dateRange: { ...tempFilters.dateRange, from: tempFilters.dateRange?.from || null, to: date || null },
                      preset: undefined,
                      singleDate: undefined
                    })}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Single Date Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Single Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !tempFilters.singleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tempFilters.singleDate ? (
                    format(tempFilters.singleDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tempFilters.singleDate || undefined}
                  onSelect={(date) => setTempFilters({
                    ...tempFilters,
                    singleDate: date || null,
                    dateRange: undefined,
                    preset: undefined
                  })}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Apply/Clear Actions */}
          <div className="flex space-x-2 pt-4 border-t border-border">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};