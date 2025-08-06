import { authHandler } from "encore.dev/auth";
import { Header, Cookie, APIError } from "encore.dev/api";
import { userDB } from "../user/db";

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  email: string;
  name: string;
  imageUrl?: string;
  provider: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    // Resolve the authenticated user from the authorization header or session cookie
    const token = data.authorization?.replace("Bearer ", "") ?? data.session?.value;
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    try {
      // Verify JWT token
      const payload = await verifyJWT(token);
      
      // Get user from database
      const user = await userDB.queryRow`
        SELECT id, email, name, image_url, provider, created_at, updated_at
        FROM users 
        WHERE id = ${payload.sub}
      `;

      if (!user) {
        throw APIError.unauthenticated("user not found");
      }

      return {
        userID: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.image_url,
        provider: user.provider
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid token", err);
    }
  }
);

async function verifyJWT(token: string): Promise<{ sub: string; email: string; exp: number }> {
  // Simple JWT verification - in production, use a proper JWT library
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error("Token expired");
    }

    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

export { auth };
