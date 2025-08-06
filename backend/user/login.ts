import { api, APIError } from "encore.dev/api";
import { userDB } from "./db";
import { generateJWT } from "./jwt";

export interface LoginRequest {
  email: string;
  provider: string;
  providerId?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
    provider: string;
  };
  token: string;
}

// Logs in an existing user.
export const login = api<LoginRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    // Find user by email and provider
    const user = await userDB.queryRow`
      SELECT id, email, name, image_url, provider
      FROM users 
      WHERE email = ${req.email} AND provider = ${req.provider}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    // Generate JWT token
    const token = await generateJWT({
      sub: user.id,
      email: user.email,
      name: user.name
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.image_url,
        provider: user.provider
      },
      token
    };
  }
);
