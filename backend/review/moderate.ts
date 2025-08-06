import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { reviewDB } from "./db";

export interface ModerateReviewRequest {
  reviewId: string;
  action: string; // 'approve', 'reject', 'flag'
  notes?: string;
}

export interface PendingReview {
  id: string;
  providerId: string;
  providerName: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  usageDuration: string;
  businessSize: string;
  useCase: string;
  wouldRecommend: boolean;
  status: string;
  reportCount: number;
  createdAt: Date;
}

export interface ListPendingReviewsResponse {
  reviews: PendingReview[];
  total: number;
}

// Moderates a review (admin only).
export const moderateReview = api<ModerateReviewRequest, { success: boolean }>(
  { auth: true, expose: true, method: "POST", path: "/reviews/:reviewId/moderate" },
  async (req) => {
    const auth = getAuthData()!;

    // TODO: Add admin role check when roles are implemented
    // For now, this endpoint exists but would need proper authorization

    const validActions = ['approve', 'reject', 'flag'];
    if (!validActions.includes(req.action)) {
      throw APIError.invalidArgument("invalid action");
    }

    // Check if review exists
    const review = await reviewDB.queryRow`
      SELECT id FROM reviews WHERE id = ${req.reviewId}
    `;

    if (!review) {
      throw APIError.notFound("review not found");
    }

    // Update review status
    await reviewDB.exec`
      UPDATE reviews 
      SET status = ${req.action === 'approve' ? 'approved' : req.action === 'reject' ? 'rejected' : 'flagged'},
          moderation_notes = ${req.notes || null},
          updated_at = NOW()
      WHERE id = ${req.reviewId}
    `;

    return { success: true };
  }
);

// Lists pending reviews for moderation (admin only).
export const listPendingReviews = api<void, ListPendingReviewsResponse>(
  { auth: true, expose: true, method: "GET", path: "/reviews/pending" },
  async () => {
    const auth = getAuthData()!;

    // TODO: Add admin role check when roles are implemented

    const reviewRows = await reviewDB.queryAll`
      SELECT 
        r.id, r.provider_id, r.provider_name, r.user_id, r.rating, r.title, r.content,
        r.pros, r.cons, r.usage_duration, r.business_size, r.use_case, r.would_recommend,
        r.status, r.created_at,
        u.name as user_name,
        COALESCE(report_counts.count, 0) as report_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN (
        SELECT review_id, COUNT(*) as count 
        FROM review_reports 
        GROUP BY review_id
      ) report_counts ON r.id = report_counts.review_id
      WHERE r.status IN ('pending', 'flagged')
      ORDER BY 
        CASE WHEN r.status = 'flagged' THEN 0 ELSE 1 END,
        report_counts.count DESC NULLS LAST,
        r.created_at ASC
    `;

    const reviews: PendingReview[] = reviewRows.map(row => ({
      id: row.id,
      providerId: row.provider_id,
      providerName: row.provider_name,
      userId: row.user_id,
      userName: row.user_name,
      rating: row.rating,
      title: row.title,
      content: row.content,
      pros: row.pros || [],
      cons: row.cons || [],
      usageDuration: row.usage_duration,
      businessSize: row.business_size,
      useCase: row.use_case,
      wouldRecommend: row.would_recommend,
      status: row.status,
      reportCount: row.report_count,
      createdAt: row.created_at
    }));

    return {
      reviews,
      total: reviews.length
    };
  }
);
