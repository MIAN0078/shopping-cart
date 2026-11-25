import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCategories, fetchProducts } from "../api/products";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import ProductCard from "../components/ProductCard";
import { EmptyView, ErrorView, LoadingView } from "../components/StatusViews";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [sp, setSp] = useSearchParams();

  // Filters URL mein rehte hain, isliye Back dabane pe wapas mil jate hain
  const q = sp.get("q") ?? "";
  const category = sp.get("category") ?? "";
  const page = Number(sp.get("page")) || 1;

  function updateParams(changes: Record<string, string>) {
    const next = new URLSearchParams(sp);
    Object.entries(changes).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if (!("page" in changes)) next.set("page", "1");
    setSp(next);
  }

  // Search text LOCAL state hai: sirf is page ko chahiye
  const [searchInput, setSearchInput] = useState(q);
  const debounced = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debounced !== q) updateParams({ q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Categories: fetchCategories component ke bahar hai, isliye stable hai
  const { data: categories } = useFetch(fetchCategories);

  const fetcher = useCallback(
    (signal: AbortSignal) =>
      fetchProducts({ search: q, category, page, limit: PAGE_SIZE }, signal),
    [q, category, page]
  );
  const { data, status, error, retry } = useFetch(fetcher);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function clearFilters() {
    setSearchInput("");
    setSp({});
  }

  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => updateParams({ category: e.target.value })}
          disabled={q.trim() !== ""}
          title={q ? "Search ke dauran category filter band hai" : ""}
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c} value={c}>
              {c.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {status === "loading" && <LoadingView />}
      {status === "error" && <ErrorView message={error ?? "Error"} onRetry={retry} />}
      {status === "success" && products.length === 0 && (
        <EmptyView
          message="Koi product nahi mila."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      )}
      {status === "success" && products.length > 0 && (
        <>
          <p className="count">{total} products</p>
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn"
                disabled={page <= 1}
                onClick={() => updateParams({ page: String(page - 1) })}
              >
                ← Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn"
                disabled={page >= totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}