"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const luxuryEase = [0.25, 1, 0.5, 1];

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal, checkoutUrl, cartError, isSyncing } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');

  // Freeze the page (and Lenis) while the drawer is open
  useEffect(() => {
    if (isCartOpen) window.__lenis?.stop();
    else window.__lenis?.start();
    return () => window.__lenis?.start();
  }, [isCartOpen]);

  // Coming back from checkout with the browser Back button should not leave the button stuck
  useEffect(() => {
    const reset = () => setIsCheckingOut(false);
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  const handleCheckout = () => {
    setError('');
    if (!cartItems.length) return;
    if (!checkoutUrl) {
      setError('Your cart is still syncing. Please try again in a moment.');
      return;
    }
    setIsCheckingOut(true);
    window.location.href = checkoutUrl; // Shopify-hosted checkout for this exact cart
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-sans selection:bg-[#C8A97E] selection:text-white">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }}
            onClick={closeCart}
            className="absolute inset-0 bg-[#15091C]/40 backdrop-blur-sm cursor-pointer"
          ></motion.div>

          {/* The Slide-Out Drawer */}
          <motion.div
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ duration: 0.7, ease: luxuryEase }}
            className="relative w-full max-w-md h-full bg-[#15091C] shadow-2xl flex flex-col border-l border-[#C8A97E]/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <h2 className="font-serif text-4xl font-light text-white tracking-tight">Your selection</h2>
              <button onClick={closeCart} className="text-[#C8A97E] text-[10px] uppercase tracking-[0.32em] hover:text-white transition-colors duration-500">
                Close
              </button>
            </div>

            {/* Cart Items */}
            <div data-lenis-prevent className="flex-grow overflow-y-auto hide-scrollbar p-8 flex flex-col gap-8">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-90">
                  <p className="font-serif text-3xl font-light text-white mb-3">Nothing here yet</p>
                  <p className="text-sm font-light text-white/70">Add an essence and it will appear here.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center group">
                    {/* Item Image */}
                    <div className="relative w-20 h-24 bg-[#FAF9FA] rounded-sm overflow-hidden flex-shrink-0">
                      <Image src={item.image || '/simpblisslogoji.png'} alt={item.title} fill sizes="80px" className="object-cover mix-blend-multiply" />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-2xl leading-tight text-white line-clamp-1">{item.title}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400 text-xs transition-colors duration-300">✕</button>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A97E] mb-4">Pure Perfume Oil</span>
                      
                      <div className="flex items-center justify-between">
                        {/* Mini Quantity Selector */}
                        <div className="flex items-center gap-4 border border-white/20 px-3 py-1 rounded-sm">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-white/50 hover:text-white transition-colors">-</button>
                          <span className="text-xs font-serif italic text-white/90">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-white/50 hover:text-white transition-colors">+</button>
                        </div>
                        <span className="text-sm font-sans text-white/90 tracking-widest">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-8 border-t border-white/10 bg-[#15091C]">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-medium">Subtotal</span>
                  <span className="text-2xl font-sans text-white tracking-widest">₹{cartTotal.toFixed(0)}</span>
                </div>
                <p className="text-[11px] font-light text-white/50 mb-6 tracking-wide">Shipping and taxes are calculated at checkout.</p>
                {(error || cartError) && <p role="alert" className="text-[12px] text-[#e8b4a0] mb-4">{error || cartError}</p>}
                
                {/* Secure Checkout Button Wired to Shopify */}
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut || isSyncing}
                  className="relative w-full bg-[#C8A97E] text-[#15091C] overflow-hidden group py-5 rounded-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {!isCheckingOut && (
                    <div className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.25,1,0.5,1)]"></div>
                  )}
                  <div className="relative z-10 flex justify-center items-center w-full transition-colors duration-[0.6s]">
                    <span className="text-[11px] uppercase tracking-[0.36em] font-medium">
                      {isCheckingOut ? "Preparing checkout" : "Secure checkout"}
                    </span>
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}