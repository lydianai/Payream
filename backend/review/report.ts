import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { reviewDB } from "./db";

export interface ReportReviewRequest {
  reviewId: string;
  reason: string;
  description?: string;
}

// Reports a review for moderation.
export const reportReview = api<ReportReviewRequest, { success: boolean }>(
  { auth: true, expose: true, method: "POST", path: "/reviews/:reviewId/report" },
  async (req) => {
    const auth = getAuthData()!;

    const validReasons = ['spam', 'inappropriate', 'fake', 'offensive', 'other'];
    if (!validReasons.includes(req.reason)) {
      throw APIError.invalidArgument("invalid reason");
    }

    // Check if review exists
    const review = await reviewDB.queryRow`
      SELECT id, user_id FROM reviews WHERE id = ${req.reviewId}
    `;

    if (!review) {
      throw APIError.notFound("review not found");
    }

    // Users cannot report their own reviews
    if (review.user_id === auth.userID) {
      throw APIError.invalidArgument("cannot report your own review");
    }

    // Check if user has already reported this review
    const existingReport = await reviewDB.queryRow`
      SELECT id FROM review_reports 
      WHERE review_id = ${req.reviewId} AND reporter_user_id = ${auth.userID}
    `;

    if (existingReport) {
      throw APIError.alreadyExists("you have already reported this review");
    }

    // Create the report
    await reviewDB.exec`
      INSERT INTO review_reports (review_id, reporter_user_id, reason, description)
      VALUES (${req.reviewId}, ${auth.userID}, ${req.reason}, ${req.description || null})
    `;

    // If this review has received multiple reports, flag it for review
    const reportCount = await reviewDB.queryRow`
      SELECT COUNT(*) as count FROM review_reports WHERE review_id = ${req.reviewId}
    `;

    if (reportCount && reportCount.count >= 3) {
      await reviewDB.exec`
        UPDATE reviews 
        SET status = 'flagged', updated_at = NOW()
        WHERE id = ${req.reviewId}
      `;
    }

    return { success: true };
  }
);
