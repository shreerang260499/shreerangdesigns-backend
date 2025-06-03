import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

const initialState = {
  items: [], // Will store minimal item data: { _id, name, price, quantity }
  total: 0,
  discount: 0,
  promoCode: null,
};

// Static promo codes for testing
const PROMO_CODES = {
  SAVE10: { percentage: 10 },
  SAVE20: { percentage: 20 },
  FLAT50: { fixedAmount: 50 },
};

// Load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window === "undefined") return initialState;
  
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : initialState;
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return initialState;
  }
};

const calculateTotals = (items, promoCode) => {
  // Remove all items with quantity 0
  const filteredItems = items.filter(item => item && item.quantity > 0);
  let subtotal = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discount = 0;
  if (promoCode && PROMO_CODES[promoCode]) {
    const codeDetails = PROMO_CODES[promoCode];
    if (codeDetails.percentage) {
      discount = (subtotal * codeDetails.percentage) / 100;
    } else if (codeDetails.fixedAmount) {
      discount = Math.min(subtotal, codeDetails.fixedAmount);
    }
  }

  const total = subtotal - discount;

  // Return both the filtered items and the totals
  return { items: filteredItems, subtotal, discount, total };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Check if item has quantity 0
      if (action.payload.quantity === 0) {
        // If the item exists in cart, remove it
        const updatedItems = state.items.filter(item => item._id !== action.payload._id);
        const { items, subtotal, total, discount } = calculateTotals(updatedItems, state.promoCode);

        toast({
          title: "फाइल हटा दी गई",
          description: "मात्रा 0 होने के कारण फाइल कार्ट से हटा दी गई है",
          variant: "default",
        });

        return { ...state, items, subtotal, total, discount };
      }

      // Check for duplicate item
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingItemIndex > -1) {
        toast({
          title: "फाइल पहले से कार्ट में है",
          description: "यह डिजाइन फाइल पहले से ही आपके कार्ट में मौजूद है",
          variant: "default",
        });
        return state;
      }

      // Add new item with quantity 1 or specified quantity
      const quantity = action.payload.quantity || 1;
      // Only store essential product data
      const minimalProduct = {
        _id: action.payload._id,
        name: action.payload.name,
        price: action.payload.price,
        imageUrl: action.payload.imageUrl,
        category: action.payload.category,
        quantity
      };
      const updatedItems = [...state.items, minimalProduct];
      const { items, subtotal, total, discount } = calculateTotals(updatedItems, state.promoCode);

      toast({
        title: "कार्ट में जोड़ा गया",
        description: "डिजाइन फाइल कार्ट में जोड़ दी गई है",
        variant: "default",
      });

      return { ...state, items, subtotal, total, discount };
    }

    case "REMOVE_ITEM": {
      const existingItemIndex = state.items.findIndex(item => item._id === action.payload);
      if (existingItemIndex === -1) return state;

      const updatedItems = state.items.filter(item => item._id !== action.payload);
      const { items, subtotal, total, discount } = calculateTotals(updatedItems, state.promoCode);

      toast({
        title: "फाइल हटा दी गई",
        description: "डिजाइन फाइल कार्ट से हटा दी गई है",
        variant: "default",
      });

      return { ...state, items, subtotal, total, discount };
    }
    
    case "APPLY_PROMO_CODE": {
      const { code, discount, description } = action.payload;
      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = subtotal - discount;
      toast({
        title: "Promo Code Applied",
        description: description,
      });
      return { ...state, total, discount, promoCode: code };
    }

    case "REMOVE_PROMO_CODE": {
      const { total } = calculateTotals(state.items, null);
      toast({
        title: "Promo Code Removed",
      });
      return { ...state, total, discount: 0, promoCode: null };
    }
    
    case "CLEAR_CART":
      return { ...initialState, items: [], total: 0, discount: 0, promoCode: null }; // Keep promoCode null
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);

  // Debounce the localStorage update to prevent excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("cart", JSON.stringify({
        items: state.items,
        promoCode: state.promoCode
      }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [state.items, state.promoCode]);

  const { token, user } = useAuth();

  // Place order with backend
  const placeOrder = async (orderData) => {
    if (!user || !token) throw new Error('Login required');
    return apiRequest(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`,
      'POST',
      orderData,
      token
    );
  };

  const addItem = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (itemId) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const applyPromoCode = async (code) => {
    try {
      const res = await apiRequest(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/promocodes/validate`, 'POST', { code });
      const discount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (res.discountPercent / 100);
      dispatch({ type: "APPLY_PROMO_CODE", payload: { code, discount, description: res.description } });
    } catch (err) {
      toast({ title: "Invalid Promo Code", description: err.message, variant: "destructive" });
      dispatch({ type: "REMOVE_PROMO_CODE" });
    }
  };

  const removePromoCode = () => {
    dispatch({ type: "REMOVE_PROMO_CODE" });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        subtotal: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        total: state.total,
        discount: state.discount,
        promoCode: state.promoCode,
        addItem,
        removeItem,
        clearCart,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        promoCodeDetails: state.promoCode ? PROMO_CODES[state.promoCode] : null
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};