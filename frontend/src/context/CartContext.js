import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0 });
      return;
    }
    const { data } = await api.get('cart/');
    setCart(data);
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('cart/', { product_id: productId, quantity });
    setCart(data);
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await api.patch(`cart/items/${itemId}/`, { quantity });
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`cart/items/${itemId}/`);
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
