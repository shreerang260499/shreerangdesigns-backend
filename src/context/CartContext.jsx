import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  discount: 0,
  promoCode: null,
};

// Sample promo codes (in a real app, these would come from a backend)
const PROMO_CODES = {
  SAVE10: { percentage: 10, description: "10% off your order" },
  SHREE200: { fixedAmount: 200, description: "₹200 off your order" },
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
  let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;

  if (promoCode && PROMO_CODES[promoCode]) {
    const codeDetails = PROMO_CODES[promoCode];
    if (codeDetails.percentage) {
      discount = (subtotal * codeDetails.percentage) / 100;
    } else if (codeDetails.fixedAmount) {
      discount = Math.min(subtotal, codeDetails.fixedAmount); // Ensure discount isn't more than subtotal
    }
  }
  const total = subtotal - discount;
  return { subtotal, discount, total };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        toast({
          title: "Already in cart",
          description: "This design is already in your cart.",
          variant: "default",
        });
        return state;
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      const { total, discount } = calculateTotals(newItems, state.promoCode);
      
      toast({
        title: "Added to cart",
        description: `${action.payload.name} has been added to your cart.`,
        variant: "default",
      });
      
      return {
        ...state,
        items: newItems,
        total,
        discount,
      };
    }
    
    case "REMOVE_ITEM": {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;

      const newItems = state.items.filter(item => item.id !== action.payload);
      const { total, discount } = calculateTotals(newItems, state.promoCode);
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
        variant: "default",
      });
      
      return {
        ...state,
        items: newItems,
        total,
        discount,
      };
    }
    
    case "APPLY_PROMO_CODE": {
      const promoCode = action.payload.toUpperCase();
      if (PROMO_CODES[promoCode]) {
        const { total, discount } = calculateTotals(state.items, promoCode);
        toast({
          title: "Promo Code Applied",
          description: PROMO_CODES[promoCode].description,
        });
        return { ...state, total, discount, promoCode };
      } else {
        toast({
          title: "Invalid Promo Code",
          description: "The promo code you entered is not valid.",
          variant: "destructive",
        });
        // If an invalid code is entered, we might want to remove any existing valid code's effect
        const { total, discount } = calculateTotals(state.items, null);
        return { ...state, total, discount, promoCode: null };
      }
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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

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

  const applyPromoCode = (code) => {
    dispatch({ type: "APPLY_PROMO_CODE", payload: code });
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