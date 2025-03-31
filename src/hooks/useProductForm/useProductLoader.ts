
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { fetchProductById } from '@/api/productApi';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormData } from './types';

export function useProductLoader(
  product?: Product,
  productId?: string,
  form?: UseFormReturn<ProductFormData>
) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!form) return;

    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      form.reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price,
        cost: product.cost || undefined,
        stock: product.stock || undefined,
        sku: product.sku || '',
        barcode: product.barcode || '',
        image_url: product.image_url || '',
        category: product.category || '',
        category_id: product.category_id || '',
        has_variants: product.has_variants || false,
      });
    } else if (productId) {
      setIsEditing(true);
      const fetchProductDetails = async () => {
        try {
          const productData = await fetchProductById(productId);
          if (productData) {
            setCurrentProduct(productData);
            form.reset({
              name: productData.name,
              description: productData.description || '',
              price: productData.price,
              cost: productData.cost || undefined,
              stock: productData.stock || undefined,
              sku: productData.sku || '',
              barcode: productData.barcode || '',
              image_url: productData.image_url || '',
              category: productData.category || '',
              category_id: productData.category_id || '',
              has_variants: productData.has_variants || false,
            });
          } else {
            throw new Error("Product not found");
          }
        } catch (error) {
          console.error("Could not fetch product details", error);
          toast.error("Failed to load product details");
        }
      };

      fetchProductDetails();
    }
  }, [product, productId, form]);

  return { isEditing, currentProduct, setCurrentProduct };
}
