import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import CartItemRow from "../components/CartItemRow";
import CartTotals from "../components/CartTotals";
import { EmptyView } from "../components/StatusViews";

export default function CartPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyView
        message="Aap ka cart khali hai."
        actionLabel="Shopping shuru karo"
        onAction={() => navigate("/")}
      />
    );
  }

  return (
    <div>
      <div className="page-head">
        <h2>Your Cart</h2>
        <button
          className="btn danger small"
          onClick={() => {
            if (window.confirm("Poora cart khali karna hai?")) clearCart();
          }}
        >
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        <aside className="summary">
          <h3>Order summary</h3>
          <CartTotals />
          {/* Login na ho to ProtectedRoute khud login page pe bhej dega */}
          <Link to="/checkout" className="btn primary full center">
            Proceed to checkout
          </Link>
          <Link to="/" className="back-link">← Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}