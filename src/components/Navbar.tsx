import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          🛒 ShopEasy
        </Link>

        <nav>
          <NavLink to="/" end>
            Products
          </NavLink>
          <NavLink to="/cart" className="cart-link">
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </NavLink>

          {user ? (
            <>
              <span className="user">Hi, {user.firstName}</span>
              <button className="btn small" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}