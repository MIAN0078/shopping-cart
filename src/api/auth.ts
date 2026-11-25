import { request } from "./client";
import type { Credentials, User } from "../types";

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export async function loginRequest(credentials: Credentials): Promise<User> {
  const data = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ ...credentials, expiresInMins: 60 }),
  });

  // Sirf wohi fields rakho jo hamein chahiye (refreshToken save nahi karte)
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    image: data.image,
    accessToken: data.accessToken,
  };
}