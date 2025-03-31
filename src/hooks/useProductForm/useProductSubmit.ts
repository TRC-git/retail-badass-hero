
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
    if (!data.name) {
      toast.error("Product name is required");
      return false;
    }
  
    if (data.price === undefined || isNaN(Number(data.price))) {
      toast.error("Valid product price is required");
      return false;
    }
  
    try {
      setIsSubmitting(true);
      console.log("Submitting product data:", data);
    
      const productData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        cost: data.cost !== undefined ? Number(data.cost) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : undefined,
        sku: data.sku,
        barcode: data.barcode,
        image_url: data.image_url,
        category_id: data.category_id === "none" ? null : data.category_id,
        category: data.category,
        has_variants: Boolean(data.has_variants)
      };
    
      let savedProduct: Product | null = null;
      
      if (isEditing && (productId || (product && product.id))) {
        const id = productId || (product?.id as string);
        console.log("Updating product with ID:", id);
        savedProduct = await updateProduct(id, productData);
        
        if (savedProduct) {
          setCurrentProduct(savedProduct);
          toast.success("Product updated successfully");
          
          if (data.has_variants) {
            // If editing a product with variants, show variant manager
            setShowVariantsManager(true);
            return true; // Don't close form yet
          }
        } else {
          throw new Error("Failed to update product");
        }
      } else {
        console.log("Creating new product");
        savedProduct = await createProduct(productData);
        
        if (savedProduct) {
          setCurrentProduct(savedProduct);
          console.log("New product created:", savedProduct);
          toast.success("Product created successfully");
          
          // If the product has variants, show the variants manager immediately
          if (data.has_variants) {
            setShowVariantsManager(true);
            return true; // Don't close the form yet
          }
        } else {
          throw new Error("Failed to create product");
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
