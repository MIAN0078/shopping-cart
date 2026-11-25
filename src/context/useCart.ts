import { useContext } from "react";
import { CartContext } from "./CartContext";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart ko <CartProvider> ke andar use karo");
  }
  return ctx;
}