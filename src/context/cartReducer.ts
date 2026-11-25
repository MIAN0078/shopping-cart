import type { CartItem, Product } from "../types";

export interface CartState {
  items: CartItem[];
}

export const initialCartState: CartState = { items: [] };

// Actions: har action ek object hai jis mein "type" hota hai
export type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "INCREASE"; payload: { id: number } }
  | { type: "DECREASE"; payload: { id: number } }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartState }; // dusre tab se sync ke liye

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const p = action.payload;
      if (p.stock <= 0) return state;

      const existing = state.items.find((i) => i.id === p.id);
      if (existing) {
        // Pehle se cart mein hai: quantity +1, lekin stock se zyada nahi
        return {
          items: state.items.map((i) =>
            i.id === p.id
              ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
              : i
          ),
        };
      }

      const newItem: CartItem = {
        id: p.id,
        title: p.title,
        price: p.price,
        thumbnail: p.thumbnail,
        stock: p.stock,
        quantity: 1,
      };
      return { items: [...state.items, newItem] };
    }

    case "INCREASE":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
            : i
        ),
      };

    case "DECREASE":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i
        ),
      };

    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };

    case "CLEAR_CART":
      return initialCartState;

    case "HYDRATE":
      return action.payload;

    default:
      return state;
  }
}