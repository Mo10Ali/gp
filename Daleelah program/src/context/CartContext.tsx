"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  destinationId: string;
  destinationTitle: string;
  destinationImage: string;
  startDate: string;
  endDate: string;
  participants: number;
  guideId?: string;
  guideName?: string;
  pricePerDay: number;
  totalPrice: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (destinationId: string) => void;
  clearCart: () => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.destinationId === item.destinationId);
      if (exists) {
        return prev.map((i) => 
          i.destinationId === item.destinationId ? item : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (destinationId: string) => {
    setCart((prev) => prev.filter((i) => i.destinationId !== destinationId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount: cart.length }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}