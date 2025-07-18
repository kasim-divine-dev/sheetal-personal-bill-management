
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Calculator, Candy } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BillingRecord } from '@/types/billing';
import { calculateBillingFields, generateBillNumber } from '@/utils/billingCalculations';
import { useToast } from '@/hooks/use-toast';

interface SweetsFormProps {
  onSubmit: (record: Omit<BillingRecord, 'id'>) => void;
}

export const SweetsForm: React.FC<SweetsFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    billStartRange: '',
    billEndRange: '',
    totalAmount: '',
    grossAmount: '',
    cgst: '',
    sgst: '',
    totalBillAmount: '',
    onlineSales: '',
    cashSales: ''
  });
  const [isCalculated, setIsCalculated] = useState(false);
  const { toast } = useToast();

  const handleCalculate = () => {
    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid total amount",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = parseFloat(formData.totalAmount);
    const calculated = calculateBillingFields(totalAmount, 'sweets');

    setFormData(prev => ({
      ...prev,
      grossAmount: calculated.grossAmount?.toString() || '',
      cgst: calculated.cgst?.toString() || '',
      sgst: calculated.sgst?.toString() || '',
      totalBillAmount: calculated.totalBillAmount?.toString() || '',
      onlineSales: calculated.onlineSales?.toString() || '',
      cashSales: calculated.cashSales?.toString() || ''
    }));
    setIsCalculated(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.billStartRange || !formData.billEndRange || !formData.totalAmount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!isCalculated) {
      toast({
        title: "Calculate First",
        description: "Please calculate the billing fields before submitting",
        variant: "destructive"
      });
      return;
    }

    const record: Omit<BillingRecord, 'id'> = {
      date: format(formData.date, 'yyyy-MM-dd'),
      billNos: generateBillNumber(parseInt(formData.billStartRange), parseInt(formData.billEndRange)),
      category: 'sweets',
      grossAmount: parseFloat(formData.grossAmount),
      cgst: parseFloat(formData.cgst),
      sgst: parseFloat(formData.sgst),
      totalBillAmount: parseFloat(formData.totalBillAmount),
      onlineSales: parseFloat(formData.onlineSales),
      cashSales: parseFloat(formData.cashSales),
      totalAmount: parseFloat(formData.totalAmount)
    };

    onSubmit(record);
    
    // Reset form
    setFormData({
      date: new Date(),
      billStartRange: '',
      billEndRange: '',
      totalAmount: '',
      grossAmount: '',
      cgst: '',
      sgst: '',
      totalBillAmount: '',
      onlineSales: '',
      cashSales: ''
    });
    setIsCalculated(false);

    toast({
      title: "Success",
      description: "Sweets billing record added successfully",
      variant: "default"
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Candy className="h-5 w-5 text-accent" />
          <span>Add Sweets Record (GST: 5%)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div>
            <Label htmlFor="date">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Bill Number Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billStartRange">Bill Start Range *</Label>
              <Input
                id="billStartRange"
                type="number"
                placeholder="e.g., 3000"
                value={formData.billStartRange}
                onChange={(e) => setFormData(prev => ({ ...prev, billStartRange: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="billEndRange">Bill End Range *</Label>
              <Input
                id="billEndRange"
                type="number"
                placeholder="e.g., 3009"
                value={formData.billEndRange}
                onChange={(e) => setFormData(prev => ({ ...prev, billEndRange: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Total Amount & Calculate Button */}
          <div>
            <Label htmlFor="totalAmount">Total Amount *</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="totalAmount"
                type="number"
                placeholder="Enter total amount"
                value={formData.totalAmount}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, totalAmount: e.target.value }));
                  setIsCalculated(false);
                }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleCalculate}
                variant="outline"
                className="shrink-0"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
            </div>
          </div>

          {/* Calculated Fields */}
          {isCalculated && (
            <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border">
              <h3 className="font-medium text-foreground mb-3">Calculated Fields (5% GST)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grossAmount">Gross Amount</Label>
                  <Input
                    id="grossAmount"
                    type="number"
                    value={formData.grossAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, grossAmount: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="totalBillAmount">Total Bill Amount</Label>
                  <Input
                    id="totalBillAmount"
                    type="number"
                    value={formData.totalBillAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalBillAmount: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cgst">CGST (2.5%)</Label>
                  <Input
                    id="cgst"
                    type="number"
                    value={formData.cgst}
                    onChange={(e) => setFormData(prev => ({ ...prev, cgst: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sgst">SGST (2.5%)</Label>
                  <Input
                    id="sgst"
                    type="number"
                    value={formData.sgst}
                    onChange={(e) => setFormData(prev => ({ ...prev, sgst: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="onlineSales">Online Sales</Label>
                  <Input
                    id="onlineSales"
                    type="number"
                    value={formData.onlineSales}
                    onChange={(e) => setFormData(prev => ({ ...prev, onlineSales: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cashSales">Cash Sales</Label>
                  <Input
                    id="cashSales"
                    type="number"
                    value={formData.cashSales}
                    onChange={(e) => setFormData(prev => ({ ...prev, cashSales: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isCalculated}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sweets Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
