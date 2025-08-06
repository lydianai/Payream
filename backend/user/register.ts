import { api, APIError } from "encore.dev/api";
import { userDB } from "./db";
import { generateJWT } from "./jwt";

export interface RegisterRequest {
  email: string;
  name: string;
  password?: string;
  provider: string;
  providerId?: string;
  imageUrl?: string;
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

// Registers a new user account.
export const register = api<RegisterRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req) => {
    // Check if user already exists
    const existingUser = await userDB.queryRow`
      SELECT id FROM users WHERE email = ${req.email}
    `;

    if (existingUser) {
      throw APIError.alreadyExists("user with this email already exists");
    }

    // Create new user
    const user = await userDB.queryRow`
      INSERT INTO users (email, name, provider, provider_id, image_url)
      VALUES (${req.email}, ${req.name}, ${req.provider}, ${req.providerId || null}, ${req.imageUrl || null})
      RETURNING id, email, name, image_url, provider
    `;

    if (!user) {
      throw APIError.internal("failed to create user");
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
