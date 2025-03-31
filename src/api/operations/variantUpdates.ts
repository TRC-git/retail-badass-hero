
import { supabase } from "@/integrations/supabase/client";
import { ProductVariant, VariantUpdate } from "../types/variantTypes";
import { cleanVariantData } from "../utils/dataCleaners";
import { toast } from "sonner";

// Update an existing variant
export const updateVariant = async (id: string, variant: VariantUpdate): Promise<ProductVariant | null> => {
  try {
    console.log("Updating variant ID:", id, "with data:", variant);
    
    // Clean the variant data before sending to Supabase
    const variantData = cleanVariantData(variant as any);
    
    // If we're updating a variant, we need to ensure we're not sending empty data
    if (Object.keys(variantData).length === 0) {
      console.log("No valid variant data to update");
      return null;
    }
    
    console.log("Cleaned variant data for update:", variantData);
    
    const { data, error } = await supabase
      .from("product_variants")
      .update(variantData)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase error updating variant:", error);
      throw error;
    }
    
    console.log("Updated variant:", data);
    
    // Convert variant_attributes from Json to Record<string, any>
    return {
      ...data,
      variant_attributes: data.variant_attributes as Record<string, any>
    };
  } catch (error) {
    console.error("Error updating variant:", error);
    toast.error(`Failed to update variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};

// Adjust variant stock levels
export const adjustVariantStock = async (id: string, stock: number): Promise<boolean> => {
  try {
    console.log("Adjusting variant stock, ID:", id, "new stock:", stock);
    
    const { error } = await supabase
      .from("product_variants")
      .update({ stock_count: stock, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      console.error("Supabase error adjusting variant stock:", error);
      throw error;
    }
    
    console.log("Variant stock updated successfully");
    toast.success("Variant inventory updated successfully");
    return true;
  } catch (error) {
    console.error("Error adjusting variant inventory:", error);
    toast.error(`Failed to update variant inventory: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
};
