import { Link, Navigate, useLocation } from "react-router-dom";
import { money, round2 } from "../utils";
import type { OrderSummary } from "../types";

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state as OrderSummary | null;

  // Seedha URL khol diya aur order data nahi hai
  if (!order) return <Navigate to="/" replace />;

  const { shippingInfo: s } = order;

  return (
    <div className="success">
      <div className="success-icon">✅</div>
      <h2>Order place ho gaya!</h2>
      <p className="muted">
        Reference: <strong>{order.orderRef}</strong> ·{" "}
        {new Date(order.placedAt).toLocaleString()}
      </p>
      <p className="muted">(Simulated order: server pe save nahi hota)</p>

      <div className="form-card left">
        <h3>Deliver to</h3>
        <p>
          {s.fullName}
          <br />
          {s.address}, {s.city}
          <br />
          {s.phone}
        </p>

        <h3>Items</h3>
        {order.items.map((i) => (
          <div key={i.id} className="line small-line">
            <span>
              {i.title} × {i.quantity}
            </span>
            <span>{money(round2(i.price * i.quantity))}</span>
          </div>
        ))}
        <hr />
        <div className="line">
          <span>Shipping</span>
          <span>{order.shipping === 0 ? "Free" : money(order.shipping)}</span>
        </div>
        <div className="line total">
          <span>Total</span>
          <span>{money(order.total)}</span>
        </div>
      </div>

      <Link to="/" className="btn primary">
        Continue shopping
      </Link>
    </div>
  );
}