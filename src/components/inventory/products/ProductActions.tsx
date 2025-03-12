
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ProductActionsProps {
  handleAddProduct: () => void;
  refreshProducts: () => void;
}

const ProductActions = ({ handleAddProduct, refreshProducts }: ProductActionsProps) => {
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleAddProduct();
  };

  return (
    <div className="flex space-x-2">
      <Button 
        onClick={handleAddClick}
        className="flex items-center gap-1"
        type="button"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </Button>
      <Button 
        variant="outline" 
        onClick={refreshProducts}
        className="flex items-center gap-1"
        type="button"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};

export default ProductActions;
