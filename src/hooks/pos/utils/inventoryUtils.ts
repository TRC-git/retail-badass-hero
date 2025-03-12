
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "../types/cartTypes";
import { toast } from "sonner";

// Check stock availability for all items in cart
export const checkStockAvailability = async (cartItems: CartItem[]): Promise<boolean> => {
  for (const item of cartItems) {
    if (item.variant_id && item.variant) {
      // Check variant stock
      const { data, error } = await supabase
        .from('product_variants')
        .select('stock_count')
        .eq('id', item.variant_id)
        .single();
        
      if (error) {
        console.error('Error checking variant stock:', error);
        toast.error(`Error checking stock for ${item.name}`);
        return false;
      }
      
      if (data.stock_count !== null && data.stock_count < item.quantity) {
        const variantDetails = [item.variant.color, item.variant.size, item.variant.flavor]
          .filter(Boolean)
          .join(' ');
        
        toast.error(`Not enough stock for ${item.name} (${variantDetails}). Only ${data.stock_count} available.`);
        return false;
      }
    } else {
      // Check regular product stock
      const { data, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single();
        
      if (error) {
        console.error('Error checking product stock:', error);
        toast.error(`Error checking stock for ${item.name}`);
        return false;
      }
      
      if (data.stock !== null && data.stock < item.quantity) {
        toast.error(`Not enough stock for ${item.name}. Only ${data.stock} available.`);
        return false;
      }
    }
  }
  
  return true;
};

// Update inventory after a transaction
export const updateInventory = async (cartItems: CartItem[]): Promise<boolean> => {
  try {
    // Create a batch of updates for better performance
    const productUpdates = [];
    const variantUpdates = [];
    
    for (const item of cartItems) {
      if (item.variant_id) {
        // Update variant stock
        const { data: currentVariant, error: variantError } = await supabase
          .from('product_variants')
          .select('stock_count')
          .eq('id', item.variant_id)
          .single();
          
        if (variantError) {
          console.error('Error fetching current variant stock:', variantError);
          continue;
        }
        
        const newStock = currentVariant.stock_count !== null 
          ? Math.max(0, currentVariant.stock_count - item.quantity) 
          : null;
          
        variantUpdates.push({
          id: item.variant_id,
          stock_count: newStock,
          updated_at: new Date().toISOString()
        });
      } else {
        // Update regular product stock
        const { data: currentProduct, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();
          
        if (productError) {
          console.error('Error fetching current product stock:', productError);
          continue;
        }
        
        const newStock = currentProduct.stock !== null 
          ? Math.max(0, currentProduct.stock - item.quantity) 
          : null;
          
        productUpdates.push({
          id: item.id,
          stock: newStock,
          updated_at: new Date().toISOString()
        });
      }
    }
    
    // Process all variant updates
    if (variantUpdates.length > 0) {
      for (const update of variantUpdates) {
        const { error } = await supabase
          .from('product_variants')
          .update({ 
            stock_count: update.stock_count,
            updated_at: update.updated_at
          })
          .eq('id', update.id);
          
        if (error) {
          console.error('Error updating variant stock:', error);
          toast.error('Some inventory updates failed');
          return false;
        }
      }
    }
    
    // Process all product updates
    if (productUpdates.length > 0) {
      for (const update of productUpdates) {
        const { error } = await supabase
          .from('products')
          .update({ 
            stock: update.stock,
            updated_at: update.updated_at
          })
          .eq('id', update.id);
          
        if (error) {
          console.error('Error updating product stock:', error);
          toast.error('Some inventory updates failed');
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating inventory:', error);
    toast.error('Failed to update inventory');
    return false;
  }
};

// New helper function to get real-time inventory level
export const getInventoryLevel = async (itemId: string, isVariant: boolean = false): Promise<number | null> => {
  try {
    if (isVariant) {
      const { data, error } = await supabase
        .from('product_variants')
        .select('stock_count')
        .eq('id', itemId)
        .single();
        
      if (error) throw error;
      return data.stock_count;
    } else {
      const { data, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', itemId)
        .single();
        
      if (error) throw error;
      return data.stock;
    }
  } catch (error) {
    console.error('Error fetching inventory level:', error);
    return null;
  }
};
