
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ProductActionsProps {
  handleAddProduct: () => void;
  refreshProducts: () => void;
}

const ProductActions = ({ handleAddProduct, refreshProducts }: ProductActionsProps) => {
  // Enhanced event handling to absolutely prevent form submission
  const handleAddClick = (e: React.MouseEvent) => {
    // Prevent default to stop any form submission
    e.preventDefault();
    // Stop event propagation to prevent it from bubbling up to parent forms
    e.stopPropagation();
    // Call the handler explicitly
    handleAddProduct();
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    refreshProducts();
  };

  return (
    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
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
        onClick={handleRefreshClick}
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
