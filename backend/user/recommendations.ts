import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { userDB } from "./db";
import { pos } from "~encore/clients";

export interface PersonalizedRecommendation {
  providerId: string;
  providerName: string;
  category: string;
  rating: number;
  commission: number;
  matchScore: number;
  matchReasons: string[];
  features: string[];
  pricing: string;
}

export interface RecommendationsResponse {
  recommendations: PersonalizedRecommendation[];
  total: number;
}

// Gets personalized POS recommendations based on user preferences and history.
export const getRecommendations = api<void, RecommendationsResponse>(
  { auth: true, expose: true, method: "GET", path: "/user/recommendations" },
  async () => {
    const auth = getAuthData()!;

    // Get user profile and preferences
    const user = await userDB.queryRow`
      SELECT preferences FROM users WHERE id = ${auth.userID}
    `;

    if (!user) {
      return { recommendations: [], total: 0 };
    }

    const preferences = user.preferences || {};

    // Get user's search history to understand patterns
    const searchHistory = await userDB.queryAll`
      SELECT query, filters FROM user_searches 
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get user's favorites to understand preferences
    const favorites = await userDB.queryAll`
      SELECT provider_category FROM user_favorites 
      WHERE user_id = ${auth.userID}
    `;

    // Get all providers
    const allProviders = await pos.search({ query: "", limit: 100 });

    // Calculate recommendations based on user data
    const recommendations = allProviders.providers.map(provider => {
      const matchScore = calculateMatchScore(provider, preferences, searchHistory, favorites);
      const matchReasons = getMatchReasons(provider, preferences, searchHistory, favorites);

      return {
        providerId: provider.id,
        providerName: provider.name,
        category: provider.category,
        rating: provider.rating,
        commission: provider.commission,
        matchScore,
        matchReasons,
        features: provider.features,
        pricing: provider.pricing
      };
    });

    // Sort by match score and return top recommendations
    const sortedRecommendations = recommendations
      .filter(rec => rec.matchScore > 0.3) // Only show relevant recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    return {
      recommendations: sortedRecommendations,
      total: sortedRecommendations.length
    };
  }
);

function calculateMatchScore(
  provider: any,
  preferences: any,
  searchHistory: any[],
  favorites: any[]
): number {
  let score = 0;

  // Category preference matching
  if (preferences.preferredCategories?.includes(provider.category)) {
    score += 0.3;
  }

  // Commission preference
  if (preferences.maxCommission && provider.commission <= preferences.maxCommission) {
    score += 0.2;
  }

  // Rating preference
  if (preferences.minRating && provider.rating >= preferences.minRating) {
    score += 0.2;
  }

  // Feature matching
  if (preferences.preferredFeatures?.length > 0) {
    const matchingFeatures = provider.features.filter((feature: string) =>
      preferences.preferredFeatures.some((pref: string) =>
        feature.toLowerCase().includes(pref.toLowerCase())
      )
    );
    score += (matchingFeatures.length / preferences.preferredFeatures.length) * 0.2;
  }

  // Search history matching
  const searchQueries = searchHistory.map(s => s.query.toLowerCase());
  const providerText = `${provider.name} ${provider.description} ${provider.features.join(' ')}`.toLowerCase();
  const searchMatches = searchQueries.filter(query =>
    query.split(' ').some(word => providerText.includes(word))
  );
  if (searchMatches.length > 0) {
    score += Math.min(searchMatches.length / searchQueries.length, 0.1);
  }

  // Favorite category matching
  const favoriteCategories = favorites.map(f => f.provider_category);
  if (favoriteCategories.includes(provider.category)) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}

function getMatchReasons(
  provider: any,
  preferences: any,
  searchHistory: any[],
  favorites: any[]
): string[] {
  const reasons: string[] = [];

  if (preferences.preferredCategories?.includes(provider.category)) {
    reasons.push(`Matches your preferred category: ${provider.category}`);
  }

  if (preferences.maxCommission && provider.commission <= preferences.maxCommission) {
    reasons.push(`Low commission rate: ${provider.commission}%`);
  }

  if (preferences.minRating && provider.rating >= preferences.minRating) {
    reasons.push(`High rating: ${provider.rating}/5`);
  }

  if (preferences.preferredFeatures?.length > 0) {
    const matchingFeatures = provider.features.filter((feature: string) =>
      preferences.preferredFeatures.some((pref: string) =>
        feature.toLowerCase().includes(pref.toLowerCase())
      )
    );
    if (matchingFeatures.length > 0) {
      reasons.push(`Has preferred features: ${matchingFeatures.join(', ')}`);
    }
  }

  const favoriteCategories = favorites.map(f => f.provider_category);
  if (favoriteCategories.includes(provider.category)) {
    reasons.push("Similar to your favorites");
  }

  if (searchHistory.length > 0) {
    const recentSearches = searchHistory.slice(0, 3).map(s => s.query);
    const hasSearchMatch = recentSearches.some(query =>
      provider.name.toLowerCase().includes(query.toLowerCase()) ||
      provider.features.some((f: string) => f.toLowerCase().includes(query.toLowerCase()))
    );
    if (hasSearchMatch) {
      reasons.push("Matches your recent searches");
    }
  }

  return reasons;
}
