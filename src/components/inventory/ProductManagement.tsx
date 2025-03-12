
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

  // Enhanced handlers with better event prevention
  const handleAddProduct = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // First set selected product to null, then open the form
    setSelectedProduct(null);
    
    // Set timeout to ensure we're out of the current event cycle
    setTimeout(() => {
      setShowAddForm(true);
    }, 0);
  }, [setSelectedProduct]);

  const handleEditProduct = useCallback((product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Set the selected product first, then show the form
    setSelectedProduct(product);
    
    // Set timeout to ensure we're out of the current event cycle
    setTimeout(() => {
      setShowEditForm(true);
    }, 0);
  }, [setSelectedProduct]);

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

  // Prevent form submissions at the component level
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (showAddForm || showEditForm || showVariantsManager)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showAddForm, showEditForm, showVariantsManager]);

  return (
    <div 
      className="space-y-4" 
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
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
