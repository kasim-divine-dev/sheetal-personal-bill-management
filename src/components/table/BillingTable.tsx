
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BillingRecord, BillingCategory } from '@/types/billing';
import { formatCurrency } from '@/utils/billingCalculations';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Candy, Coffee, Cake } from 'lucide-react';

interface BillingTableProps {
  records: BillingRecord[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  category: BillingCategory;
}

type SortField = keyof BillingRecord;
type SortDirection = 'asc' | 'desc' | null;

const getCategoryInfo = (category: BillingCategory) => {
  switch (category) {
    case 'sweets':
      return { name: 'Sweets', icon: Candy, color: 'text-green-500', gst: '5%' };
    case 'khajur-chocolate':
      return { name: 'Khajur & Chocolate', icon: Coffee, color: 'text-orange-500', gst: '12%' };
    case 'cakes-bakery':
      return { name: 'Cakes & Bakery', icon: Cake, color: 'text-pink-500', gst: '18%' };
  }
};

export const BillingTable: React.FC<BillingTableProps> = ({
  records,
  searchTerm,
  onSearchChange,
  category
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const categoryInfo = getCategoryInfo(category);
  const IconComponent = categoryInfo.icon;

  // Dynamic column configuration based on category
  const getColumns = () => {
    const baseColumns = [
      { key: 'date' as SortField, label: 'Date', width: 'w-28 sm:w-32' },
      { key: 'billNos' as SortField, label: 'Bill Nos.', width: 'w-28 sm:w-32' },
      { key: 'grossAmount' as SortField, label: 'Gross Amt.', width: 'w-28 sm:w-32', currency: true },
    ];

    // Add GST columns based on category
    if (category === 'sweets') {
      baseColumns.push(
        { key: 'cgst' as SortField, label: 'CGST 2.5%', width: 'w-24 sm:w-28', currency: true },
        { key: 'sgst' as SortField, label: 'SGST 2.5%', width: 'w-24 sm:w-28', currency: true }
      );
    } else if (category === 'khajur-chocolate') {
      baseColumns.push(
        { key: 'cgst' as SortField, label: 'CGST 6%', width: 'w-24 sm:w-28', currency: true },
        { key: 'sgst' as SortField, label: 'SGST 6%', width: 'w-24 sm:w-28', currency: true }
      );
    } else if (category === 'cakes-bakery') {
      baseColumns.push(
        { key: 'cgst' as SortField, label: 'CGST 9%', width: 'w-24 sm:w-28', currency: true },
        { key: 'sgst' as SortField, label: 'SGST 9%', width: 'w-24 sm:w-28', currency: true }
      );
    }

    baseColumns.push({ key: 'totalBillAmount' as SortField, label: 'Total Bill Amt.', width: 'w-32 sm:w-36', currency: true });

    // Add category-specific columns
    if (category === 'sweets') {
      baseColumns.push(
        { key: 'onlineSales' as SortField, label: 'Online Sales', width: 'w-28 sm:w-32', currency: true },
        { key: 'cashSales' as SortField, label: 'Cash Sales', width: 'w-28 sm:w-32', currency: true }
      );
    } else if (category === 'khajur-chocolate') {
      baseColumns.push(
        { key: 'khajurAmount' as SortField, label: 'Khajur Amt.', width: 'w-28 sm:w-32', currency: true },
        { key: 'chocolateAmount' as SortField, label: 'Chocolate Amt.', width: 'w-32 sm:w-36', currency: true }
      );
    }

    baseColumns.push({ key: 'totalAmount' as SortField, label: 'Total Amount', width: 'w-32 sm:w-36', currency: true });

    return baseColumns;
  };

  const columns = getColumns();

  // Filtering and sorting logic
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = [...records];

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter(record => {
          const value = record[column as keyof BillingRecord];
          return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = aValue.toString().localeCompare(bValue.toString());
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    return filtered;
  }, [records, columnFilters, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedRecords.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRecords = filteredAndSortedRecords.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
    return <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />;
  };

  const handleExportCSV = () => {
    const headers = columns.map(col => col.label);
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedRecords.map(record => 
        columns.map(col => {
          const value = record[col.key];
          return value !== undefined ? value.toString() : '';
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category}-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <IconComponent className={`h-5 w-5 ${categoryInfo.color}`} />
            <span>{categoryInfo.name} Records (GST: {categoryInfo.gst})</span>
          </CardTitle>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Import CSV
            </Button>
          </div>
        </div>
        
        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search across all fields..." 
            value={searchTerm} 
            onChange={e => onSearchChange(e.target.value)} 
            className="pl-9 text-sm sm:text-base" 
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                {columns.map(column => (
                  <TableHead key={column.key} className={`${column.width} font-medium text-xs sm:text-sm`}>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium hover:bg-transparent text-xs sm:text-sm" 
                      onClick={() => handleSort(column.key)}
                    >
                      <span className="mr-1 sm:mr-2">{column.label}</span>
                      {getSortIcon(column.key)}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                    No records found for {categoryInfo.name}
                  </TableCell>
                </TableRow>
              ) : (
                currentRecords.map(record => (
                  <TableRow key={record.id} className="hover:bg-secondary/20 transition-colors">
                    {columns.map(column => (
                      <TableCell key={column.key} className="py-2 sm:py-3 text-xs sm:text-sm">
                        {column.currency ? (
                          <Badge variant="secondary" className="font-mono text-xs">
                            {formatCurrency(record[column.key] as number)}
                          </Badge>
                        ) : (
                          <span className="text-xs sm:text-sm">
                            {record[column.key]?.toString()}
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-muted-foreground">Rows per page:</span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={value => {
                setPageSize(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16 sm:w-20 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, filteredAndSortedRecords.length)} of {filteredAndSortedRecords.length}
            </span>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="text-xs sm:text-sm p-1 sm:p-2"
              >
                <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="text-xs sm:text-sm p-1 sm:p-2"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="text-xs sm:text-sm p-1 sm:p-2"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                className="text-xs sm:text-sm p-1 sm:p-2"
              >
                <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
