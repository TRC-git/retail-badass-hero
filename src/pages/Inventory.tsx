
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManagement from "@/components/inventory/ProductManagement";
import CategoryManagement from "@/components/inventory/CategoryManagement";
import InventoryAdjustments from "@/components/inventory/InventoryAdjustments";
import { ProductProvider } from "@/contexts/ProductContext";
import { toast } from "sonner";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<string>("products");
  
  // Add a more aggressive form submission preventer
  const preventFormSubmission = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Use effect to add global event listener to prevent unexpected behaviors
  useEffect(() => {
    // Handler for any submit event at the document level
    const handleSubmit = (e: Event) => {
      // If we're on the inventory page and have open dialogs, prevent form submissions
      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (dialogs.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    
    // Prevent page unloads during modal operations
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const modalOpen = document.querySelector('[role="dialog"]');
      if (modalOpen) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Add global submit prevention
    document.addEventListener('submit', handleSubmit, { capture: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('submit', handleSubmit, { capture: true });
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Layout>
      <div 
        className="container mx-auto p-6" 
        onSubmit={preventFormSubmission}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
        </div>

        <ProductProvider>
          <Tabs 
            defaultValue="products" 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value);
              // Display a helpful toast when switching to products tab
              if (value === "products") {
                toast.info(
                  "Create products with variants by enabling the 'Has Variants' toggle during product creation",
                  { duration: 4000 }
                );
              }
            }}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="adjustments">Inventory Adjustments</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <CategoryManagement />
            </TabsContent>

            <TabsContent value="adjustments" className="space-y-4">
              <InventoryAdjustments />
            </TabsContent>
          </Tabs>
        </ProductProvider>
      </div>
    </Layout>
  );
};

export default Inventory;
