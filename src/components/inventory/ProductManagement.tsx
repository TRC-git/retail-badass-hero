import React, { useState, useCallback, useEffect } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent } from "@/components/ui/card";
import { deleteProduct } from "@/api/productApi";
import { toast } from "sonner";
import ProductTable from "./products/ProductTable";
import ProductSearch from "./products/ProductSearch";
import ProductHeader from "./products/ProductHeader";
import ProductModals from "./products/ProductModals";

const ProductManagement = () => {
  const {
    products,
    loading,
    refreshProducts,
    selectedProduct,
    setSelectedProduct
  } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showVariantsManager, setShowVariantsManager] = useState(false);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Refactored to match the working variant button behavior
  const handleAddProduct = useCallback(() => {
    // First reset state
    setSelectedProduct(null);
    // Then set the form visibility with setTimeout
    setTimeout(() => {
      setShowAddForm(true);
    }, 0);
  }, [setSelectedProduct]);

  // Refactored to match the working variant button behavior
  const handleEditProduct = useCallback((product: any) => {
    // First set the product
    setSelectedProduct(product);
    // Then set the form visibility with setTimeout
    setTimeout(() => {
      setShowEditForm(true);
    }, 0);
  }, [setSelectedProduct]);

  // Keep the working implementation
  const handleManageVariants = useCallback((product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setSelectedProduct(product);
    
    // Set timeout to ensure we're out of the current event cycle
    setTimeout(() => {
      setShowVariantsManager(true);
    }, 0);
  }, [setSelectedProduct]);

  const handleDeleteProduct = async (id: string) => {
    try {
      const success = await deleteProduct(id);
      if (success) {
        toast.success("Product deleted successfully");
        refreshProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product");
    }
  };

  // Prevent form submissions using a global keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent 'Enter' key from submitting forms when modals are open
      if (e.key === 'Enter' && (showAddForm || showEditForm || showVariantsManager)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    
    // Add the event listener
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [showAddForm, showEditForm, showVariantsManager]);

  return (
    <div 
      className="space-y-4" 
      onClick={(e) => e.stopPropagation()}
    >
      <ProductHeader 
        handleAddProduct={handleAddProduct} 
        refreshProducts={refreshProducts} 
      />

      <ProductSearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <Card>
        <CardContent className="p-0">
          <ProductTable 
            products={filteredProducts}
            loading={loading}
            handleEditProduct={handleEditProduct}
            handleManageVariants={handleManageVariants}
            handleDeleteProduct={handleDeleteProduct}
          />
        </CardContent>
      </Card>

      {/* Product modals (Add, Edit, Variants) */}
      <ProductModals
        selectedProduct={selectedProduct}
        showAddForm={showAddForm}
        showEditForm={showEditForm}
        showVariantsManager={showVariantsManager}
        setShowAddForm={setShowAddForm}
        setShowEditForm={setShowEditForm}
        setShowVariantsManager={setShowVariantsManager}
        setSelectedProduct={setSelectedProduct}
        refreshProducts={refreshProducts}
      />
    </div>
  );
};

export default ProductManagement;
