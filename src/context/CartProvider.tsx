import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  CartContext,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  type CartContextValue,
} from "./CartContext";
import {
  cartReducer,
  initialCartState,
  type CartState,
} from "./cartReducer";
import type { Product } from "../types";
import { round2 } from "../utils";

const STORAGE_KEY = "shop.cart.v1";

// localStorage se cart padho. Kharab/purana data ho to khali cart do.
function loadCart(fallback: CartState): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.items)) return fallback;

    const items = parsed.items.filter(
      (i: unknown): i is CartState["items"][number] =>
        typeof i === "object" &&
        i !== null &&
        typeof (i as { id: unknown }).id === "number" &&
        typeof (i as { quantity: unknown }).quantity === "number" &&
        typeof (i as { price: unknown }).price === "number"
    );
    return { items };
  } catch {
    return fallback;
  }
}

export default function CartProvider({ children }: { children: ReactNode }) {
  // 3rd argument (loadCart) sirf pehli baar chalta hai (lazy initializer)
  const [state, dispatch] = useReducer(cartReducer, initialCartState, loadCart);

  // Save: state badle to localStorage mein likho
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full ya private mode: app phir bhi chalti hai */
    }
  }, [state]);

  // Sync: dusre tab mein cart badle to yahan bhi update ho
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        dispatch({ type: "HYDRATE", payload: loadCart(initialCartState) });
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // dispatch stable hota hai, isliye yeh functions bhi stable rehte hain
  const addItem = useCallback(
    (product: Product) => dispatch({ type: "ADD_ITEM", payload: product }),
    []
  );
  const increase = useCallback(
    (id: number) => dispatch({ type: "INCREASE", payload: { id } }),
    []
  );
  const decrease = useCallback(
    (id: number) => dispatch({ type: "DECREASE", payload: { id } }),
    []
  );
  const removeItem = useCallback(
    (id: number) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  // useMemo: items na badle to har consumer ko naya object nahi milega,
  // is se bekar re-renders kam hote hain
  const value = useMemo<CartContextValue>(() => {
    const { items } = state;
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
    const shipping =
      items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    return {
      items,
      totalItems,
      subtotal,
      shipping,
      total: round2(subtotal + shipping),
      addItem,
      increase,
      decrease,
      removeItem,
      clearCart,
      getQuantity: (id: number) => items.find((i) => i.id === id)?.quantity ?? 0,
    };
  }, [state, addItem, increase, decrease, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}