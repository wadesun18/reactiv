import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { ReactNode, createContext, useEffect, useState } from "react";

import { Product, ProductVariant } from "./ProductContext";
import { CART_STORAGE_KEY } from "../constants";

export type CartItem = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, variant: ProductVariant) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => string;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  getTotalPrice: () => "",
});

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart data from AsyncStorage on mount. In real app, we should call cart endpoint
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from storage", error);
      }
    };
    loadCart();
  }, []);

  // Save cart data to AsyncStorage whenever cartItems change.
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to storage", error);
      }
    };
    saveCart();
  }, [cartItems]);

  const addToCart = (product: Product, variant: ProductVariant) => {
    // should make an API call to add the item to cart so we can refresh the list
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id && item.variant.id === variant.id,
      );
      if (existingIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { product, variant, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    // should make an API call to add the item to cart
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product.id === productId && item.variant.id === variantId),
      ),
    );
  };

  const clearCart = () => {
    // make an api call to empty the cart
    setCartItems([]);
  };

  const getTotalPrice = (): string => {
    const total = cartItems.reduce((total, item) => {
      const price = parseFloat(item.variant.price.amount);
      return total + price * item.quantity;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
