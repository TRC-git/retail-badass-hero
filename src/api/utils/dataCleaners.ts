
import { ProductInsert } from "../types/productTypes";
import { VariantInsert } from "../types/variantTypes";

// Clean product data before sending to the database
export const cleanProductData = (product: ProductInsert): ProductInsert => {
  // Ensure required fields are included
  if (!product.name || product.price === undefined) {
    throw new Error("Product name and price are required");
  }

  // Create a clean product object
  const cleanedProduct: ProductInsert = {
    name: product.name.trim(),
    price: product.price,
    description: product.description || null,
    cost: product.cost !== undefined ? product.cost : null,
    stock: product.stock !== undefined ? product.stock : null,
    sku: product.sku || null,
    barcode: product.barcode || null,
    image_url: product.image_url || null,
    category: product.category || null,
    category_id: product.category_id || null,
    has_variants: product.has_variants || false
  };

  // Logging for debugging
  console.log("Cleaned product data:", JSON.stringify(cleanedProduct, null, 2));
  
  return cleanedProduct;
};

// Clean variant data before sending to the database
export const cleanVariantData = (variant: VariantInsert): VariantInsert => {
  // Ensure required fields are included
  if (!variant.product_id) {
    throw new Error("Product ID is required for variants");
  }

  // Create a clean variant object
  const cleanedVariant: VariantInsert = {
    product_id: variant.product_id,
    price: variant.price !== undefined ? variant.price : 0,
    sku: variant.sku || null,
    stock_count: variant.stock_count !== undefined ? variant.stock_count : null,
    color: variant.color || null,
    size: variant.size || null,
    flavor: variant.flavor || null,
    variant_attributes: variant.variant_attributes || {}
  };

  return cleanedVariant;
};
