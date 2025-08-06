import { api, APIError } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { userDB } from "./db";

export interface SaveSearchRequest {
  query: string;
  filters: Record<string, any>;
  resultsCount: number;
}

export interface UserSearch {
  id: number;
  query: string;
  filters: Record<string, any>;
  resultsCount: number;
  createdAt: Date;
}

export interface SearchHistoryResponse {
  searches: UserSearch[];
  total: number;
}

// Saves a user's search for future reference.
export const saveSearch = api<SaveSearchRequest, { id: number }>(
  { auth: true, expose: true, method: "POST", path: "/user/searches" },
  async (req) => {
    const auth = getAuthData()!;

    const search = await userDB.queryRow`
      INSERT INTO user_searches (user_id, query, filters, results_count)
      VALUES (${auth.userID}, ${req.query}, ${JSON.stringify(req.filters)}, ${req.resultsCount})
      RETURNING id
    `;

    if (!search) {
      throw APIError.internal("failed to save search");
    }

    return { id: search.id };
  }
);

// Retrieves the user's search history.
export const getSearchHistory = api<{ limit?: Query<number> }, SearchHistoryResponse>(
  { auth: true, expose: true, method: "GET", path: "/user/searches" },
  async (req) => {
    const auth = getAuthData()!;
    const limit = req.limit || 20;

    const searches = await userDB.queryAll`
      SELECT id, query, filters, results_count, created_at
      FROM user_searches 
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    const total = await userDB.queryRow`
      SELECT COUNT(*) as count FROM user_searches WHERE user_id = ${auth.userID}
    `;

    return {
      searches: searches.map(search => ({
        id: search.id,
        query: search.query,
        filters: search.filters,
        resultsCount: search.results_count,
        createdAt: search.created_at
      })),
      total: total?.count || 0
    };
  }
);

// Deletes a saved search.
export const deleteSearch = api<{ id: number }, void>(
  { auth: true, expose: true, method: "DELETE", path: "/user/searches/:id" },
  async (req) => {
    const auth = getAuthData()!;

    await userDB.exec`
      DELETE FROM user_searches 
      WHERE id = ${req.id} AND user_id = ${auth.userID}
    `;
  }
);
