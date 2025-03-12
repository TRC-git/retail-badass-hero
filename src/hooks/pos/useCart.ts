
import { useState, useEffect } from "react";
import { formatTaxRulesFromSettings } from "@/utils/taxCalculator";
import { calculateTotalTax } from "@/utils/taxCalculator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem, Product } from "./types/cartTypes";
import { prepareCartItem, updateCartWithNewItem, calculateSubtotal } from "./utils/cartUtils";
import { processTransaction as processTransactionUtil } from "./utils/transactionUtils";
import { loadTabItems } from "./utils/transactionUtils";
import { getInventoryLevel } from "./utils/inventoryUtils";

export { type CartItem, type Product, isValidCartItem } from "./types/cartTypes";

export const useCart = (taxRate: number) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [inventoryUpdated, setInventoryUpdated] = useState<boolean>(false);

  // Set up real-time subscription for inventory changes
  useEffect(() => {
    // Create a Supabase channel to listen for inventory changes
    const productsChannel = supabase
      .channel('real-time-inventory-products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log('Product inventory changed:', payload);
          // Update local cart items if the modified product is in the cart
          updateCartItemStock(false, payload.new?.id, payload.new?.stock);
        }
      )
      .subscribe();
      
    // Create another channel for variant changes
    const variantsChannel = supabase
      .channel('real-time-inventory-variants')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'product_variants' }, 
        (payload) => {
          console.log('Variant inventory changed:', payload);
          // Update local cart items if the modified variant is in the cart
          updateCartItemStock(true, payload.new?.id, payload.new?.stock_count);
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(variantsChannel);
    };
  }, [cartItems]);
  
  // Helper function to update stock in cart items when inventory changes
  const updateCartItemStock = (isVariant: boolean, id?: string, newStock?: number) => {
    if (!id || newStock === undefined) return;
    
    setCartItems(current => 
      current.map(item => {
        if (isVariant && item.variant_id === id) {
          // Update variant stock
          return {
            ...item,
            variant: item.variant ? {
              ...item.variant,
              stock_count: newStock
            } : null
          };
        } else if (!isVariant && item.id === id && !item.variant_id) {
          // Update product stock
          return {
            ...item,
            stock: newStock
          };
        }
        return item;
      })
    );
    
    setInventoryUpdated(true);
  };

  // Add product to cart, with or without a variant
  const addToCart = async (product: Product, variantId?: string) => {
    try {
      // Prepare the item (with stock checks)
      const itemToAdd = await prepareCartItem(product, variantId);
      
      if (!itemToAdd) {
        // Error message is already displayed in prepareCartItem
        return;
      }
      
      // Update the cart
      const updatedCart = updateCartWithNewItem(cartItems, itemToAdd);
      setCartItems(updatedCart);
      
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const updateItemQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove the item if quantity is 0 or negative
      removeItem(index);
    } else {
      // Check stock before updating
      const item = cartItems[index];
      
      // For variant products, get real-time inventory level
      if (item.variant_id && item.variant) {
        const currentStock = await getInventoryLevel(item.variant_id, true);
        
        if (currentStock !== null && newQuantity > currentStock) {
          toast.error(`Only ${currentStock} units available`);
          return;
        }
      } 
      // For regular products, get real-time inventory level
      else {
        const currentStock = await getInventoryLevel(item.id);
        
        if (currentStock !== null && newQuantity > currentStock) {
          toast.error(`Only ${currentStock} units available`);
          return;
        }
      }
      
      // Update quantity
      const updatedCart = [...cartItems];
      updatedCart[index].quantity = newQuantity;
      setCartItems(updatedCart);
    }
  };

  const removeItem = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getSubtotal = () => {
    return calculateSubtotal(cartItems);
  };

  // Use the dynamic tax calculator
  const getTaxAmount = () => {
    // For now we'll just use the default tax rate since we haven't stored
    // the tax rules in the database yet
    const taxRules = formatTaxRulesFromSettings([], taxRate);
    return calculateTotalTax(
      cartItems.map(item => ({
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      taxRules,
      taxRate
    );
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount();
  };

  // Process the transaction and update inventory
  const processTransaction = async (paymentDetails: any) => {
    const result = await processTransactionUtil(
      cartItems,
      getSubtotal(),
      getTaxAmount(),
      getTotal(),
      selectedCustomer?.id || null,
      paymentDetails
    );
    
    if (result) {
      setInventoryUpdated(true);
    }
    
    return result;
  };

  const handleCheckoutTab = async (tabId: string) => {
    try {
      const { cartItems: tabItems, customerId } = await loadTabItems(tabId);
      
      // Set the cart items
      setCartItems(tabItems);
      
      // Fetch and set customer if there's a customer_id
      if (customerId) {
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", customerId)
          .single();
          
        if (!customerError && customerData) {
          setSelectedCustomer(customerData);
        }
      }
    } catch (error) {
      console.error("Unexpected error loading tab:", error);
    }
  };

  return {
    cartItems,
    selectedCustomer,
    setSelectedCustomer,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTaxAmount,
    getTotal,
    handleCheckoutTab,
    processTransaction,
    inventoryUpdated
  };
};
