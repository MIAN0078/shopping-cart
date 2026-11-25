export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ListParams {
  search: string;
  category: string;
  page: number;
  limit: number;
}

// Cart mein product ka sirf zaroori hissa save hota hai
export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface OrderSummary {
  orderRef: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: ShippingInfo;
  placedAt: string;
}

export type Status = "loading" | "success" | "error";