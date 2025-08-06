import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { userDB } from "./db";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  provider: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  preferredCategories: string[];
  maxCommission: number;
  minRating: number;
  preferredFeatures: string[];
  businessSize: string;
  industry: string;
  monthlyVolume: string;
}

export interface UpdateProfileRequest {
  name?: string;
  preferences?: Partial<UserPreferences>;
}

// Retrieves the current user's profile.
export const getProfile = api<void, UserProfile>(
  { auth: true, expose: true, method: "GET", path: "/user/profile" },
  async () => {
    const auth = getAuthData()!;

    const user = await userDB.queryRow`
      SELECT id, email, name, image_url, provider, preferences, created_at, updated_at
      FROM users 
      WHERE id = ${auth.userID}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.image_url,
      provider: user.provider,
      preferences: user.preferences || {
        preferredCategories: [],
        maxCommission: 5.0,
        minRating: 0,
        preferredFeatures: [],
        businessSize: "",
        industry: "",
        monthlyVolume: ""
      },
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
);

// Updates the current user's profile.
export const updateProfile = api<UpdateProfileRequest, UserProfile>(
  { auth: true, expose: true, method: "PUT", path: "/user/profile" },
  async (req) => {
    const auth = getAuthData()!;

    // Get current user data
    const currentUser = await userDB.queryRow`
      SELECT preferences FROM users WHERE id = ${auth.userID}
    `;

    if (!currentUser) {
      throw APIError.notFound("user not found");
    }

    // Merge preferences
    const currentPreferences = currentUser.preferences || {};
    const updatedPreferences = req.preferences ? 
      { ...currentPreferences, ...req.preferences } : 
      currentPreferences;

    // Update user
    const user = await userDB.queryRow`
      UPDATE users 
      SET 
        name = COALESCE(${req.name}, name),
        preferences = ${JSON.stringify(updatedPreferences)},
        updated_at = NOW()
      WHERE id = ${auth.userID}
      RETURNING id, email, name, image_url, provider, preferences, created_at, updated_at
    `;

    if (!user) {
      throw APIError.internal("failed to update user");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.image_url,
      provider: user.provider,
      preferences: user.preferences,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
);
