import { api, APIError } from "encore.dev/api";
import bcrypt from "bcryptjs";
let lastLoginTime = 0;
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
    // Basit rate limit: 2 saniyede birden fazla giriş engellenir
    if (Date.now() - lastLoginTime < 2000) {
      throw APIError.tooManyRequests("Çok hızlı giriş denemesi. Lütfen tekrar deneyin.");
    }
    lastLoginTime = Date.now();

    // Find user by email and provider
    const user = await userDB.queryRow`
      SELECT id, email, name, image_url, provider, password_hash
      FROM users 
      WHERE email = ${req.email} AND provider = ${req.provider}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    // Bot koruma: Şifre minimum uzunluk kontrolü
    if (!req.providerId && (!req.password || req.password.length < 6)) {
      throw APIError.invalidArgument("Şifre en az 6 karakter olmalı.");
    }

    // Şifre doğrulama
    if (req.password && !(await bcrypt.compare(req.password, user.password_hash))) {
      throw APIError.permissionDenied("Şifre yanlış.");
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
