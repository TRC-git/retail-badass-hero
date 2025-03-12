
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ProductActionsProps {
  handleAddProduct: () => void;
  refreshProducts: () => void;
}

const ProductActions = ({ handleAddProduct, refreshProducts }: ProductActionsProps) => {
  // Create separate click handlers with aggressive event prevention
  const handleAddClick = (e: React.MouseEvent) => {
    // Stop the event completely to prevent any form submission
    e.preventDefault();
    e.stopPropagation();
    
    // Use setTimeout to ensure we're out of the current event cycle
    setTimeout(() => {
      handleAddProduct();
    }, 0);
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
