
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Barcode, PackageOpen } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ProductFormData } from './types';

interface InventoryDetailsProps {
  form: UseFormReturn<ProductFormData>;
  categories: { id: string; name: string; }[];
}

const InventoryDetails: React.FC<InventoryDetailsProps> = ({ form, categories }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU</FormLabel>
            <FormControl>
              <div className="relative">
                <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="SKU" className="pl-10" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="barcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Barcode</FormLabel>
            <FormControl>
              <div className="relative">
                <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Barcode" className="pl-10" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock</FormLabel>
            <FormControl>
              <div className="relative">
                <PackageOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="number" 
                  min={0} 
                  placeholder="0" 
                  className="pl-10" 
                  {...field}
                  value={field.value === undefined ? '' : field.value} 
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select 
              value={field.value || "none"} 
              onValueChange={(value) => {
                if (value === "none") {
                  form.setValue("category_id", "none");
                  form.setValue("category", "");
                } else {
                  const selectedCategory = categories.find(cat => cat.id === value);
                  form.setValue("category_id", value);
                  if (selectedCategory) {
                    form.setValue("category", selectedCategory.name);
                  }
                }
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="has_variants"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Has Variants</FormLabel>
              <FormDescription>
                Enable if this product has multiple variants (size, color, etc.)
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default InventoryDetails;
