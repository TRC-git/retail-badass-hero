
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/types";
import ProductForm from "../ProductForm";
import { ProductVariantsManager } from "../ProductVariantsManager";

interface ProductModalsProps {
  selectedProduct: Product | null;
  showAddForm: boolean;
  showEditForm: boolean;
  showVariantsManager: boolean;
  setShowAddForm: (show: boolean) => void;
  setShowEditForm: (show: boolean) => void;
  setShowVariantsManager: (show: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  refreshProducts: () => void;
}

const ProductModals: React.FC<ProductModalsProps> = ({
  selectedProduct,
  showAddForm,
  showEditForm,
  showVariantsManager,
  setShowAddForm,
  setShowEditForm,
  setShowVariantsManager,
  setSelectedProduct,
  refreshProducts
}) => {
  // Enhanced handlers to absolutely prevent form submission
  const handleFormClose = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedProduct(null);
    refreshProducts();
  };

  const handleVariantsClose = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowVariantsManager(false);
    setSelectedProduct(null);
    refreshProducts();
  };

  // Handle dialog open change with improved event handling
  const handleAddFormOpenChange = (open: boolean, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!open) {
      handleFormClose();
    }
  };

  const handleEditFormOpenChange = (open: boolean, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!open) {
      handleFormClose();
    }
  };

  const handleVariantsOpenChange = (open: boolean, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!open) {
      handleVariantsClose();
    }
  };

  return (
    <>
      {/* Dialog for adding products */}
      <Dialog 
        open={showAddForm} 
        onOpenChange={(open) => handleAddFormOpenChange(open)}
      >
        <DialogContent 
          className="max-w-7xl max-h-[85vh] bg-background overflow-y-auto custom-scrollbar"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle>Add New Product</DialogTitle>
          {showAddForm && (
            <ProductForm 
              onClose={handleFormClose} 
              onSave={refreshProducts} 
              threeColumns={true} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog for editing products */}
      <Dialog 
        open={showEditForm} 
        onOpenChange={(open) => handleEditFormOpenChange(open)}
      >
        <DialogContent 
          className="max-w-7xl max-h-[85vh] bg-background overflow-y-auto custom-scrollbar"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle>Edit Product</DialogTitle>
          {showEditForm && selectedProduct && (
            <ProductForm 
              product={selectedProduct} 
              onClose={handleFormClose} 
              onSave={refreshProducts} 
              threeColumns={true} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog for managing variants */}
      <Dialog 
        open={showVariantsManager} 
        onOpenChange={(open) => handleVariantsOpenChange(open)}
      >
        <DialogContent 
          className="sm:max-w-[800px] max-h-[90vh]"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {showVariantsManager && selectedProduct && (
            <ProductVariantsManager 
              product={selectedProduct} 
              onClose={handleVariantsClose} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductModals;
