
import React from "react";
import { formatCurrency } from "@/utils/formatters";
import { ProductVariant } from "@/hooks/pos/types/cartTypes";
import { Badge } from "@/components/ui/badge";

interface VariantDetailsProps {
  variant: ProductVariant;
}

const VariantDetails: React.FC<VariantDetailsProps> = ({ variant }) => {
  // Determine stock status for better visualization
  const getStockStatus = () => {
    if (variant.stock_count === null) return null;
    if (variant.stock_count <= 0) return "outOfStock";
    if (variant.stock_count <= 5) return "lowStock";
    return "inStock";
  };

  const stockStatus = getStockStatus();

  return (
    <div className="pt-4 space-y-2 border-t">
      <div className="flex justify-between">
        <span className="font-medium">Price:</span>
        <span>{formatCurrency(variant.price)}</span>
      </div>
      
      {variant.stock_count !== null && (
        <div className="flex justify-between items-center">
          <span className="font-medium">Stock:</span>
          {stockStatus === "outOfStock" ? (
            <Badge variant="destructive" className="font-medium">
              Out of stock
            </Badge>
          ) : stockStatus === "lowStock" ? (
            <span className="text-red-500 font-medium">
              {variant.stock_count} available
            </span>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {variant.stock_count} available
            </Badge>
          )}
        </div>
      )}
      
      {variant.sku && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>SKU:</span>
          <span>{variant.sku}</span>
        </div>
      )}
    </div>
  );
};

export default VariantDetails;
