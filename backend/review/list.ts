import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { reviewDB } from "./db";
import type { Review } from "./create";

export interface ListReviewsRequest {
  providerId?: Query<string>;
  userId?: Query<string>;
  status?: Query<string>;
  rating?: Query<number>;
  sortBy?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

export interface ListReviewsResponse {
  reviews: Review[];
  total: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

// Retrieves reviews with filtering and pagination.
export const listReviews = api<ListReviewsRequest, ListReviewsResponse>(
  { expose: true, method: "GET", path: "/reviews" },
  async (req) => {
    const auth = getAuthData();
    const limit = req.limit || 20;
    const offset = req.offset || 0;
    const sortBy = req.sortBy || "created_at";

    let whereConditions = ["r.status = 'approved'"];
    let params: any[] = [];
    let paramIndex = 1;

    // Build WHERE conditions
    if (req.providerId) {
      whereConditions.push(`r.provider_id = $${paramIndex}`);
      params.push(req.providerId);
      paramIndex++;
    }

    if (req.userId) {
      whereConditions.push(`r.user_id = $${paramIndex}`);
      params.push(req.userId);
      paramIndex++;
    }

    if (req.rating) {
      whereConditions.push(`r.rating = $${paramIndex}`);
      params.push(req.rating);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Determine sort order
    let orderBy = "r.created_at DESC";
    switch (sortBy) {
      case "rating":
        orderBy = "r.rating DESC, r.created_at DESC";
        break;
      case "helpful":
        orderBy = "r.helpful_count DESC, r.created_at DESC";
        break;
      case "newest":
        orderBy = "r.created_at DESC";
        break;
      case "oldest":
        orderBy = "r.created_at ASC";
        break;
    }

    // Get reviews with user information and vote status
    const reviewsQuery = `
      SELECT 
        r.id, r.provider_id, r.provider_name, r.user_id, r.rating, r.title, r.content,
        r.pros, r.cons, r.usage_duration, r.business_size, r.use_case, r.would_recommend,
        r.is_verified, r.status, r.helpful_count, r.unhelpful_count, r.created_at, r.updated_at,
        u.name as user_name, u.image_url as user_image_url,
        rv.vote_type as user_vote
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN review_votes rv ON r.id = rv.review_id AND rv.user_id = $${paramIndex}
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
    `;

    params.push(auth?.userID || null, limit, offset);

    const reviewRows = await reviewDB.rawQueryAll(reviewsQuery, ...params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      ${whereClause}
    `;
    const countParams = params.slice(0, -3); // Remove auth.userID, limit, offset
    const countResult = await reviewDB.rawQueryRow(countQuery, ...countParams);
    const total = countResult?.total || 0;

    // Get average rating and distribution for the provider
    let averageRating = 0;
    let ratingDistribution: { rating: number; count: number; percentage: number; }[] = [];

    if (req.providerId) {
      const statsQuery = `
        SELECT 
          AVG(rating)::DECIMAL(3,2) as avg_rating,
          rating,
          COUNT(*) as count
        FROM reviews 
        WHERE provider_id = $1 AND status = 'approved'
        GROUP BY rating
        ORDER BY rating DESC
      `;

      const statsRows = await reviewDB.rawQueryAll(statsQuery, req.providerId);
      
      if (statsRows.length > 0) {
        averageRating = parseFloat(statsRows[0].avg_rating) || 0;
        
        const totalReviews = statsRows.reduce((sum, row) => sum + parseInt(row.count), 0);
        ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
          const found = statsRows.find(row => row.rating === rating);
          const count = found ? parseInt(found.count) : 0;
          return {
            rating,
            count,
            percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
          };
        });
      }
    }

    const reviews: Review[] = reviewRows.map(row => ({
      id: row.id,
      providerId: row.provider_id,
      providerName: row.provider_name,
      userId: row.user_id,
      userName: row.user_name,
      userImageUrl: row.user_image_url,
      rating: row.rating,
      title: row.title,
      content: row.content,
      pros: row.pros || [],
      cons: row.cons || [],
      usageDuration: row.usage_duration,
      businessSize: row.business_size,
      useCase: row.use_case,
      wouldRecommend: row.would_recommend,
      isVerified: row.is_verified,
      status: row.status,
      helpfulCount: row.helpful_count,
      unhelpfulCount: row.unhelpful_count,
      userVote: row.user_vote,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return {
      reviews,
      total,
      averageRating,
      ratingDistribution
    };
  }
);
