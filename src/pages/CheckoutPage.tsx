import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import CartTotals from "../components/CartTotals";
import { money, round2 } from "../utils";
import type { OrderSummary, ShippingInfo } from "../types";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState<ShippingInfo>({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    phone: "",
    address: "",
    city: "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cart khali hai to checkout ka koi matlab nahi
  if (items.length === 0) return <Navigate to="/cart" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const digits = form.phone.replace(/\D/g, "");
    if (!form.fullName.trim()) return setError("Poora naam zaroori hai");
    if (digits.length < 10) return setError("Phone number kam az kam 10 digits ka ho");
    if (!form.address.trim()) return setError("Address zaroori hai");
    if (!form.city.trim()) return setError("City zaroori hai");

    setPlacing(true);
    setError(null);

    try {
      await createOrder(user.id, items);

      const order: OrderSummary = {
        orderRef: `ORD-${Date.now().toString().slice(-8)}`,
        items,
        subtotal,
        shipping,
        total,
        shippingInfo: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
        },
        placedAt: new Date().toISOString(),
      };

      // Pehle navigate, phir cart khali (dono ek hi batch mein render hote hain)
      navigate("/order-success", { replace: true, state: order });
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order place nahi hua");
      setPlacing(false);
    }
  }

  return (
    <div>
      <h2>Checkout</h2>

      <div className="cart-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Shipping details</h3>

          <label>
            Full name
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Address
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          <label>
            City
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </label>

          <p className="muted">💵 Payment: Cash on Delivery</p>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn primary full" disabled={placing}>
            {placing ? "Placing order..." : `Place order · ${money(total)}`}
          </button>
        </form>

        <aside className="summary">
          <h3>Your items</h3>
          {items.map((i) => (
            <div key={i.id} className="line small-line">
              <span>
                {i.title} × {i.quantity}
              </span>
              <span>{money(round2(i.price * i.quantity))}</span>
            </div>
          ))}
          <hr />
          <CartTotals />
        </aside>
      </div>
    </div>
  );
}