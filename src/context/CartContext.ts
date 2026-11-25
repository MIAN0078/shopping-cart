import { createContext } from "react";
import type { CartItem, Product } from "../types";

export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 5;

export interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (product: Product) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  getQuantity: (id: number) => number;
}

export const CartContext = createContext<CartContextValue | null>(null);