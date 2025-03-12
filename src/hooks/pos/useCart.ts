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

interface RealtimeProductPayload {
  new: {
    id: string;
    stock: number | null;
    [key: string]: any;
  };
  old: {
    id: string;
    stock: number | null;
    [key: string]: any;
  };
  eventType: string;
}

interface RealtimeVariantPayload {
  new: {
    id: string;
    stock_count: number | null;
    [key: string]: any;
  };
  old: {
    id: string;
    stock_count: number | null;
    [key: string]: any;
  };
  eventType: string;
}

export const useCart = (taxRate: number) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [inventoryUpdated, setInventoryUpdated] = useState<boolean>(false);

  useEffect(() => {
    const productsChannel = supabase
      .channel('real-time-inventory-products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log('Product inventory changed:', payload);
          const newData = payload.new as RealtimeProductPayload['new'] | undefined;
          if (newData && typeof newData.id === 'string') {
            updateCartItemStock(false, newData.id, newData.stock);
          }
        }
      )
      .subscribe();
      
    const variantsChannel = supabase
      .channel('real-time-inventory-variants')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'product_variants' }, 
        (payload) => {
          console.log('Variant inventory changed:', payload);
          const newData = payload.new as RealtimeVariantPayload['new'] | undefined;
          if (newData && typeof newData.id === 'string') {
            updateCartItemStock(true, newData.id, newData.stock_count);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(variantsChannel);
    };
  }, [cartItems]);
  
  const updateCartItemStock = (isVariant: boolean, id?: string, newStock?: number | null) => {
    if (!id || newStock === undefined) return;
    
    setCartItems(current => 
      current.map(item => {
        if (isVariant && item.variant_id === id) {
          return {
            ...item,
            variant: item.variant ? {
              ...item.variant,
              stock_count: newStock
            } : null
          };
        } else if (!isVariant && item.id === id && !item.variant_id) {
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

  const addToCart = async (product: Product, variantId?: string) => {
    try {
      const itemToAdd = await prepareCartItem(product, variantId);
      
      if (!itemToAdd) {
        return;
      }
      
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
      removeItem(index);
    } else {
      const item = cartItems[index];
      
      if (item.variant_id && item.variant) {
        const currentStock = await getInventoryLevel(item.variant_id, true);
        
        if (currentStock !== null && newQuantity > currentStock) {
          toast.error(`Only ${currentStock} units available`);
          return;
        }
      } 
      else {
        const currentStock = await getInventoryLevel(item.id);
        
        if (currentStock !== null && newQuantity > currentStock) {
          toast.error(`Only ${currentStock} units available`);
          return;
        }
      }
      
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

  const getTaxAmount = () => {
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
      
      setCartItems(tabItems);
      
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
