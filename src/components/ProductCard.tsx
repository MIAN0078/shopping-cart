import { Link } from "react-router-dom";
import QuantityControl from "./QuantityControl";
import { useCart } from "../context/useCart";
import { money } from "../utils";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, increase, decrease, removeItem, getQuantity } = useCart();
  const qty = getQuantity(product.id);
  const outOfStock = product.stock === 0;

  return (
    <div className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.thumbnail} alt={product.title} className="card-img" />
      </Link>

      <div className="card-body">
        <Link to={`/products/${product.id}`}>
          <h3>{product.title}</h3>
        </Link>
        <p className="muted">
          {product.brand ?? product.category} · ⭐ {product.rating}
        </p>
        <p className="price">{money(product.price)}</p>

        {qty === 0 ? (
          <button
            className="btn primary full"
            disabled={outOfStock}
            onClick={() => addItem(product)}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </button>
        ) : (
          <QuantityControl
            quantity={qty}
            max={product.stock}
            onIncrease={() => increase(product.id)}
            // Card pe 1 se neeche jane ka matlab: cart se hata do
            onDecrease={() =>
              qty === 1 ? removeItem(product.id) : decrease(product.id)
            }
          />
        )}
      </div>
    </div>
  );
}