"use client";
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getCart, cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove } from '../lib/shopify';

const CartContext = createContext();
const STORAGE_KEY = 'sb_cart_id';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartError, setCartError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const cartIdRef = useRef(null);
  const queue = useRef(Promise.resolve()); // runs cart mutations one at a time

  const saveId = (id) => {
    cartIdRef.current = id;
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const applyCart = (cart) => {
    if (!cart) {
      saveId(null);
      setCartItems([]);
      setCheckoutUrl(null);
      return;
    }
    saveId(cart.id);
    setCartItems(cart.items);
    setCheckoutUrl(cart.checkoutUrl);
  };

  // Restore the cart after refresh / when the visitor comes back
  useEffect(() => {
    let id = null;
    try { id = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!id) return;
    cartIdRef.current = id;
    getCart(id)
      .then((cart) => applyCart(cart)) // null => cart expired or order completed
      .catch(() => {});                // network blip: keep id, try again next load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Serialise server calls; on failure resync from Shopify so UI never lies
  const run = useCallback((optimistic, task) => {
    setCartError('');
    if (optimistic) optimistic();
    setIsSyncing(true);
    queue.current = queue.current
      .then(task)
      .then((cart) => { if (cart) applyCart(cart); })
      .catch(async (err) => {
        console.error('Cart error:', err);
        setCartError('We could not update your cart. Please try again.');
        if (cartIdRef.current) {
          try { applyCart(await getCart(cartIdRef.current)); } catch (e) {}
        }
      })
      .finally(() => setIsSyncing(false));
    return queue.current;
  }, []);

  const toggleCart = () => setIsCartOpen((o) => !o);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // product: { id: <variant id>, title, image, price }
  const addToCart = (product, quantity = 1) => {
    run(
      () => {
        setCartItems((prev) => {
          const existing = prev.find((i) => i.id === product.id);
          if (existing) return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
          return [...prev, { ...product, quantity }];
        });
      },
      async () => {
        const line = { merchandiseId: product.id, quantity };
        if (cartIdRef.current) {
          try {
            return await cartLinesAdd(cartIdRef.current, [line]);
          } catch (e) {
            // cart may have expired: start a fresh one
            saveId(null);
          }
        }
        return cartCreate([line]);
      }
    );
    openCart();
  };

  const removeFromCart = (variantId) => {
    const item = cartItems.find((i) => i.id === variantId);
    run(
      () => setCartItems((prev) => prev.filter((i) => i.id !== variantId)),
      async () => {
        if (!item?.lineId || !cartIdRef.current) return null;
        return cartLinesRemove(cartIdRef.current, [item.lineId]);
      }
    );
  };

  const updateQuantity = (variantId, amount) => {
    const item = cartItems.find((i) => i.id === variantId);
    if (!item) return;
    const quantity = Math.max(1, item.quantity + amount);
    if (quantity === item.quantity) return;
    run(
      () => setCartItems((prev) => prev.map((i) => (i.id === variantId ? { ...i, quantity } : i))),
      async () => {
        if (!item.lineId || !cartIdRef.current) return null;
        return cartLinesUpdate(cartIdRef.current, [{ id: item.lineId, quantity }]);
      }
    );
  };

  const cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems, isCartOpen, toggleCart, openCart, closeCart,
        addToCart, removeFromCart, updateQuantity, cartTotal,
        checkoutUrl, cartError, isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
