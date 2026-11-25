import { FREE_SHIPPING_THRESHOLD } from "../context/CartContext";
import { useCart } from "../context/useCart";
import { money } from "../utils";

export default function CartTotals() {
  const { totalItems, subtotal, shipping, total } = useCart();

  return (
    <div className="totals">
      <div className="line">
        <span>Items ({totalItems})</span>
        <span>{money(subtotal)}</span>
      </div>
      <div className="line">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : money(shipping)}</span>
      </div>
      {shipping > 0 && (
        <p className="muted">
          {money(FREE_SHIPPING_THRESHOLD - subtotal)} aur khareedo to shipping free
        </p>
      )}
      <div className="line total">
        <span>Total</span>
        <span>{money(total)}</span>
      </div>
    </div>
  );
}