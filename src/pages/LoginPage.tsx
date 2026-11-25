import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { user, loading, error, login, clearError } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Login ho gaya (ya pehle se login tha): jahan se aaye the wahan wapas
  if (user) return <Navigate to={from} replace />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    void login({ username: username.trim(), password });
  }

  function fillDemo() {
    clearError();
    setUsername("emilys");
    setPassword("emilyspass");
  }

  return (
    <form className="auth-box" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {from === "/checkout" && (
        <p className="muted">Checkout ke liye pehle login karo.</p>
      )}

      <label>
        Username
        <input
          value={username}
          autoComplete="username"
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) clearError();
          }}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) clearError();
          }}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn primary full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <button type="button" className="btn full" onClick={fillDemo}>
        Demo credentials bharo
      </button>
    </form>
  );
}