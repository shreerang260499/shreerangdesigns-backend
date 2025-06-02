import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Tag, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartItem from "@/components/CartItem";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, generateId } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const CartPage = () => {
  const { 
    items, 
    subtotal, 
    total, 
    discount, 
    promoCode, 
    promoCodeDetails,
    removeItem, 
    clearCart, 
    applyPromoCode,
    removePromoCode,
    placeOrder 
  } = useCart();
  const { user, addPurchaseToHistory } = useAuth();
  const navigate = useNavigate();
  const [promoCodeInput, setPromoCodeInput] = useState("");
  
  // Debug log to check cart items
  console.log('Cart items in CartPage:', items);

  // Debug log to check cart items being rendered
  console.log('Rendering cart items:', items);

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if (window.Cashfree) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
        action: <Button onClick={() => navigate("/login")}>Login</Button>,
      });
      return;
    }
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items to proceed.",
        variant: "default",
      });
      return;
    }
    try {
      // 1. Create Cashfree order via backend
      const orderId = `order_${generateId()}`;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          orderId,
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: user.mobile || '9999999999',
        })
      });
      const data = await res.json();
      if (!data.payment_session_id) throw new Error('Failed to create payment order');

      // 2. Load Cashfree script
      const loaded = await loadCashfreeScript();
      if (!loaded) throw new Error('Cashfree SDK failed to load');

      // 3. Open Cashfree payment modal
      const cashfree = new window.Cashfree(data.payment_session_id);
      cashfree.redirect();
    } catch (err) {
      toast({ title: "Checkout Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleApplyPromoCode = () => {
    if (promoCodeInput.trim() === "") {
      toast({ title: "Enter Promo Code", description: "Please enter a promo code to apply.", variant: "default" });
      return;
    }
    applyPromoCode(promoCodeInput);
    setPromoCodeInput(""); 
  };
  
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/designs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {items.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="border rounded-lg overflow-hidden">
                  <div className="divide-y">
                    {items.map((item) => (
                      <CartItem 
                        key={item._id} // Use _id for unique key
                        item={item} 
                        onRemove={removeItem} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="border rounded-lg p-6 bg-accent/30 space-y-4 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({promoCodeDetails?.description || promoCode})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <div className="space-y-2 pt-4">
                    {!promoCode ? (
                      <>
                        <div className="flex gap-2">
                          <Input 
                            type="text" 
                            placeholder="Enter promo code" 
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            className="flex-grow"
                          />
                          <Button onClick={handleApplyPromoCode} variant="outline" className="shrink-0">
                            <Tag className="h-4 w-4 mr-2"/> Apply
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between text-sm p-2 bg-green-100 text-green-700 rounded-md">
                        <span>Promo: {promoCode} applied!</span>
                        <Button variant="ghost" size="icon" onClick={removePromoCode} className="h-6 w-6 text-green-700 hover:text-green-800">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Taxes included. Downloads available immediately after purchase.
                  </p>
                  
                  <div className="mt-6 space-y-2">
                    <Button 
                      size="lg" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg"
                      onClick={handleCheckout}
                    >
                      Pay Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any designs to your cart yet.
            </p>
            <Link to="/designs">
              <Button>Browse Designs</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CartPage;