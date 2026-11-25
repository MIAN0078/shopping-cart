import { Link } from "react-router-dom";
import QuantityControl from "./QuantityControl";
import { useCart } from "../context/useCart";
import { money, round2 } from "../utils";
import type { CartItem } from "../types";

export default function CartItemRow({ item }: { item: CartItem }) {
  const { increase, decrease, removeItem } = useCart();

  return (
    <div className="cart-row">
      <img src={item.thumbnail} alt={item.title} />

      <div className="cart-info">
        <Link to={`/products/${item.id}`}>
          <strong>{item.title}</strong>
        </Link>
        <p className="muted">{money(item.price)} each</p>
        {item.quantity >= item.stock && (
          <p className="muted warn">Max stock reached</p>
        )}
      </div>

      <QuantityControl
        quantity={item.quantity}
        max={item.stock}
        onIncrease={() => increase(item.id)}
        onDecrease={() => decrease(item.id)}
      />

      <div className="line-total">{money(round2(item.price * item.quantity))}</div>

      <button
        className="btn danger small"
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.title}`}
      >
        Remove
      </button>
    </div>
  );
}