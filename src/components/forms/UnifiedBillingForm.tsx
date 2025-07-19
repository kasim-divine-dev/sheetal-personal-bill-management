
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BillingRecord, BillingCategory } from '@/types/billing';
import { SweetsForm } from './SweetsForm';
import { KhajurChocolateForm } from './KhajurChocolateForm';
import { CakesBakeryForm } from './CakesBakeryForm';
import { Candy, Coffee, Cake, Plus } from 'lucide-react';

interface UnifiedBillingFormProps {
  onSubmit: (record: Omit<BillingRecord, 'id'>) => void;
}

const categoryOptions = [
  { value: 'sweets' as BillingCategory, label: 'Sweets (GST: 5%)', icon: Candy },
  { value: 'khajur-chocolate' as BillingCategory, label: 'Khajur & Chocolate (GST: 12%)', icon: Coffee },
  { value: 'cakes-bakery' as BillingCategory, label: 'Cakes & Bakery (GST: 18%)', icon: Cake },
];

export const UnifiedBillingForm: React.FC<UnifiedBillingFormProps> = ({ onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState<BillingCategory | null>('sweets');

  const renderForm = () => {
    if (!selectedCategory) {
      return (
        <div className="text-center py-12">
          <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a Category</h3>
          <p className="text-muted-foreground">Choose a billing category above to start adding records</p>
        </div>
      );
    }

    switch (selectedCategory) {
      case 'sweets':
        return <SweetsForm onSubmit={onSubmit} />;
      case 'khajur-chocolate':
        return <KhajurChocolateForm onSubmit={onSubmit} />;
      case 'cakes-bakery':
        return <CakesBakeryForm onSubmit={onSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 lg:col-span-9">
      {/* Category Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-accent" />
            <span>Add Billing Record</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Select Category *</Label>
              <Select
                value={selectedCategory || ''}
                onValueChange={(value) => setSelectedCategory(value as BillingCategory)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Choose billing category..." />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Form Content */}
      {renderForm()}
    </div>
  );
};
