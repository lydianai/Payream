import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { reviewDB } from "./db";

export interface CreateReviewRequest {
  providerId: string;
  providerName: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  usageDuration: string;
  businessSize: string;
  useCase: string;
  wouldRecommend: boolean;
}

export interface Review {
  id: string;
  providerId: string;
  providerName: string;
  userId: string;
  userName: string;
  userImageUrl?: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  usageDuration: string;
  businessSize: string;
  useCase: string;
  wouldRecommend: boolean;
  isVerified: boolean;
  status: string;
  helpfulCount: number;
  unhelpfulCount: number;
  userVote?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new review for a POS provider.
export const createReview = api<CreateReviewRequest, { id: string }>(
  { auth: true, expose: true, method: "POST", path: "/reviews" },
  async (req) => {
    const auth = getAuthData()!;

    // Validate rating
    if (req.rating < 1 || req.rating > 5) {
      throw APIError.invalidArgument("rating must be between 1 and 5");
    }

    // Validate required fields
    if (!req.title.trim() || !req.content.trim()) {
      throw APIError.invalidArgument("title and content are required");
    }

    if (req.title.length > 255) {
      throw APIError.invalidArgument("title must be 255 characters or less");
    }

    if (req.content.length > 5000) {
      throw APIError.invalidArgument("content must be 5000 characters or less");
    }

    // Check if user has already reviewed this provider
    const existingReview = await reviewDB.queryRow`
      SELECT id FROM reviews 
      WHERE provider_id = ${req.providerId} AND user_id = ${auth.userID}
    `;

    if (existingReview) {
      throw APIError.alreadyExists("you have already reviewed this provider");
    }

    // Create the review
    const review = await reviewDB.queryRow`
      INSERT INTO reviews (
        provider_id, provider_name, user_id, rating, title, content, 
        pros, cons, usage_duration, business_size, use_case, would_recommend
      )
      VALUES (
        ${req.providerId}, ${req.providerName}, ${auth.userID}, ${req.rating}, 
        ${req.title}, ${req.content}, ${req.pros}, ${req.cons}, 
        ${req.usageDuration}, ${req.businessSize}, ${req.useCase}, ${req.wouldRecommend}
      )
      RETURNING id
    `;

    if (!review) {
      throw APIError.internal("failed to create review");
    }

    return { id: review.id };
  }
);
