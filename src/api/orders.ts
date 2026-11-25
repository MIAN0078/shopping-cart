import { request } from "./client";
import type { CartItem } from "../types";

interface OrderResponse {
  id: number;
  total: number;
  totalProducts: number;
  totalQuantity: number;
}

// DummyJSON ka "add cart" endpoint order ki tarah use kar rahe hain (simulated)
export function createOrder(userId: number, items: CartItem[]) {
  return request<OrderResponse>("/carts/add", {
    method: "POST",
    body: JSON.stringify({
      userId,
      products: items.map((i) => ({ id: i.id, quantity: i.quantity })),
    }),
  });
}