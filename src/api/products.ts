import { request } from "./client";
import type { ListParams, Product, ProductsResponse } from "../types";

export function fetchProducts(params: ListParams, signal?: AbortSignal) {
  const { search, category, page, limit } = params;

  const query = new URLSearchParams({
    limit: String(limit),
    skip: String((page - 1) * limit),
  });

  let path = "/products";
  if (search.trim()) {
    path = "/products/search";
    query.set("q", search.trim());
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}`;
  }

  return request<ProductsResponse>(`${path}?${query}`, { signal });
}

export function fetchCategories(signal?: AbortSignal) {
  return request<string[]>("/products/category-list", { signal });
}

export function fetchProduct(id: number, signal?: AbortSignal) {
  return request<Product>(`/products/${id}`, { signal });
}