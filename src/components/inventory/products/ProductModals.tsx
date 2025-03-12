
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
  const handleFormClose = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Closing form dialog");
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

  // Handle dialog open change with event prevention
  const handleAddFormOpenChange = (open: boolean) => {
    if (!open) {
      handleFormClose();
    } else {
      setShowAddForm(true);
    }
  };

  const handleEditFormOpenChange = (open: boolean) => {
    if (!open) {
      handleFormClose();
    } else {
      setShowEditForm(true);
    }
  };

  const handleVariantsOpenChange = (open: boolean) => {
    if (!open) {
      handleVariantsClose();
    } else {
      setShowVariantsManager(true);
    }
  };

  return (
    <>
      {/* Dialog for adding products */}
      <Dialog 
        open={showAddForm} 
        onOpenChange={handleAddFormOpenChange}
      >
        <DialogContent className="max-w-7xl max-h-[85vh] bg-background overflow-y-auto custom-scrollbar">
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
        onOpenChange={handleEditFormOpenChange}
      >
        <DialogContent className="max-w-7xl max-h-[85vh] bg-background overflow-y-auto custom-scrollbar">
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
        onOpenChange={handleVariantsOpenChange}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
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
