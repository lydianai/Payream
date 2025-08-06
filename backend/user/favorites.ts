import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { userDB } from "./db";

export interface AddFavoriteRequest {
  providerId: string;
  providerName: string;
  providerCategory: string;
}

export interface UserFavorite {
  id: number;
  providerId: string;
  providerName: string;
  providerCategory: string;
  createdAt: Date;
}

export interface FavoritesResponse {
  favorites: UserFavorite[];
  total: number;
}

// Adds a provider to user's favorites.
export const addFavorite = api<AddFavoriteRequest, { id: number }>(
  { auth: true, expose: true, method: "POST", path: "/user/favorites" },
  async (req) => {
    const auth = getAuthData()!;

    try {
      const favorite = await userDB.queryRow`
        INSERT INTO user_favorites (user_id, provider_id, provider_name, provider_category)
        VALUES (${auth.userID}, ${req.providerId}, ${req.providerName}, ${req.providerCategory})
        RETURNING id
      `;

      if (!favorite) {
        throw APIError.internal("failed to add favorite");
      }

      return { id: favorite.id };
    } catch (err: any) {
      if (err.message?.includes("unique")) {
        throw APIError.alreadyExists("provider already in favorites");
      }
      throw err;
    }
  }
);

// Retrieves user's favorite providers.
export const getFavorites = api<void, FavoritesResponse>(
  { auth: true, expose: true, method: "GET", path: "/user/favorites" },
  async () => {
    const auth = getAuthData()!;

    const favorites = await userDB.queryAll`
      SELECT id, provider_id, provider_name, provider_category, created_at
      FROM user_favorites 
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `;

    return {
      favorites: favorites.map(fav => ({
        id: fav.id,
        providerId: fav.provider_id,
        providerName: fav.provider_name,
        providerCategory: fav.provider_category,
        createdAt: fav.created_at
      })),
      total: favorites.length
    };
  }
);

// Removes a provider from user's favorites.
export const removeFavorite = api<{ providerId: string }, void>(
  { auth: true, expose: true, method: "DELETE", path: "/user/favorites/:providerId" },
  async (req) => {
    const auth = getAuthData()!;

    await userDB.exec`
      DELETE FROM user_favorites 
      WHERE provider_id = ${req.providerId} AND user_id = ${auth.userID}
    `;
  }
);
