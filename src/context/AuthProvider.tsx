import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import {
  authReducer,
  initialAuthState,
  type AuthState,
} from "./authReducer";
import { loginRequest } from "../api/auth";
import type { Credentials, User } from "../types";

const STORAGE_KEY = "shop.user.v1";

function loadUser(fallback: AuthState): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const user = JSON.parse(raw) as User;
    if (typeof user?.id !== "number" || !user.accessToken) return fallback;
    return { ...fallback, user };
  } catch {
    return fallback;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState, loadUser);

  // User badle to save karo, logout pe hata do
  useEffect(() => {
    try {
      if (state.user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [state.user]);

  const login = useCallback(async (credentials: Credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const user = await loginRequest(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err instanceof Error ? err.message : "Login failed",
      });
    }
  }, []);

  const logout = useCallback(() => dispatch({ type: "LOGOUT" }), []);
  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      login,
      logout,
      clearError,
    }),
    [state.user, state.loading, state.error, login, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}