import { createContext } from "react";
import type { Credentials, User } from "../types";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);