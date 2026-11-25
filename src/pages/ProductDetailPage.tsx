import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import { useCart } from "../context/useCart";
import QuantityControl from "../components/QuantityControl";
import { ErrorView, LoadingView } from "../components/StatusViews";
import { money } from "../utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);

  const fetcher = useCallback(
    (signal: AbortSignal) => fetchProduct(productId, signal),
    [productId]
  );
  const { data: product, status, error, retry } = useFetch(fetcher);
  const { addItem, increase, decrease, removeItem, getQuantity } = useCart();

  if (status === "loading") return <LoadingView />;

  if (status === "error" || !product) {
    return (
      <>
        <Link to="/" className="back">← Back to products</Link>
        <ErrorView message={error ?? "Product not found"} onRetry={retry} />
      </>
    );
  }

  const qty = getQuantity(product.id);
  const outOfStock = product.stock === 0;

  return (
    <div>
      <Link to="/" className="back">← Back to products</Link>

      <div className="detail">
        <img src={product.thumbnail} alt={product.title} className="detail-img" />

        <div className="detail-body">
          <h2>{product.title}</h2>
          <p className="muted">
            {product.brand ?? "No brand"} · {product.category} · ⭐ {product.rating}
          </p>
          <p className="price big">{money(product.price)}</p>
          <p>{product.description}</p>
          <p className={product.stock < 10 ? "warn" : "muted"}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </p>

          {qty === 0 ? (
            <button
              className="btn primary"
              disabled={outOfStock}
              onClick={() => addItem(product)}
            >
              Add to cart
            </button>
          ) : (
            <div className="detail-actions">
              <QuantityControl
                quantity={qty}
                max={product.stock}
                onIncrease={() => increase(product.id)}
                onDecrease={() =>
                  qty === 1 ? removeItem(product.id) : decrease(product.id)
                }
              />
              <Link to="/cart" className="btn">
                Go to cart →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}