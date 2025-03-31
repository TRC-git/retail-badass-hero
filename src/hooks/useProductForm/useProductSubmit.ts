
import { useState } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { ProductFormData } from './types';
import { createProduct, updateProduct } from '@/api/productApi';

export function useProductSubmit(
  isEditing: boolean,
  productId: string | undefined,
  product: Product | undefined,
  setCurrentProduct: (product: Product | null) => void,
  setShowVariantsManager: (show: boolean) => void,
  onSave?: () => void,
  onClose?: () => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormData): Promise<boolean> => {
    try {
      if (!data.name) {
        toast.error("Product name is required");
        return false;
      }
    
      if (data.price === undefined || isNaN(Number(data.price))) {
        toast.error("Valid product price is required");
        return false;
      }
      
      setIsSubmitting(true);
      console.log("Submitting product data:", data);
    
      // Process category_id properly
      let categoryId = data.category_id;
      if (categoryId === "" || categoryId === "none") {
        categoryId = null;
      }
      
      const productData = {
        name: data.name,
        description: data.description || "",
        price: Number(data.price),
        cost: data.cost !== undefined ? Number(data.cost) : null,
        stock: data.stock !== undefined ? Number(data.stock) : null,
        sku: data.sku || "",
        barcode: data.barcode || "",
        image_url: data.image_url || "",
        category_id: categoryId,
        category: data.category || "",
        has_variants: Boolean(data.has_variants)
      };
    
      let savedProduct: Product | null = null;
      
      if (isEditing && (productId || (product && product.id))) {
        const id = productId || (product?.id as string);
        console.log("Updating product with ID:", id);
        
        try {
          savedProduct = await updateProduct(id, productData);
          if (!savedProduct) {
            throw new Error("Failed to update product - no data returned");
          }
        } catch (updateError) {
          console.error("Error in updateProduct API call:", updateError);
          throw updateError;
        }
        
        setCurrentProduct(savedProduct);
        toast.success("Product updated successfully");
        
        if (data.has_variants) {
          // If editing a product with variants, show variant manager
          setShowVariantsManager(true);
          return true; // Don't close form yet
        }
      } else {
        console.log("Creating new product with data:", productData);
        
        try {
          savedProduct = await createProduct(productData);
          if (!savedProduct) {
            throw new Error("Failed to create product - no data returned");
          }
        } catch (createError) {
          console.error("Error in createProduct API call:", createError);
          throw createError;
        }
        
        console.log("New product created:", savedProduct);
        setCurrentProduct(savedProduct);
        toast.success("Product created successfully");
        
        // If the product has variants, show the variants manager immediately
        if (data.has_variants) {
          setShowVariantsManager(true);
          return true; // Don't close the form yet
        }
      }
    
      if (onSave) onSave();
      if (!data.has_variants && onClose) {
        onClose(); // Only close if it's not a variant product or if we're editing
      }
      return true;
    
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product: ' + (error instanceof Error ? error.message : "Unknown error"));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
}
