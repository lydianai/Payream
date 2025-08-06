import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { reviewDB } from "./db";

export interface UpdateReviewRequest {
  reviewId: string;
  rating?: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
  usageDuration?: string;
  businessSize?: string;
  useCase?: string;
  wouldRecommend?: boolean;
}

// Updates an existing review (only by the author).
export const updateReview = api<UpdateReviewRequest, { success: boolean }>(
  { auth: true, expose: true, method: "PUT", path: "/reviews/:reviewId" },
  async (req) => {
    const auth = getAuthData()!;

    // Check if review exists and belongs to the user
    const review = await reviewDB.queryRow`
      SELECT id, user_id FROM reviews 
      WHERE id = ${req.reviewId} AND user_id = ${auth.userID}
    `;

    if (!review) {
      throw APIError.notFound("review not found or you don't have permission to edit it");
    }

    // Validate rating if provided
    if (req.rating !== undefined && (req.rating < 1 || req.rating > 5)) {
      throw APIError.invalidArgument("rating must be between 1 and 5");
    }

    // Validate title and content length if provided
    if (req.title !== undefined && req.title.length > 255) {
      throw APIError.invalidArgument("title must be 255 characters or less");
    }

    if (req.content !== undefined && req.content.length > 5000) {
      throw APIError.invalidArgument("content must be 5000 characters or less");
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.rating !== undefined) {
      updates.push(`rating = $${paramIndex}`);
      params.push(req.rating);
      paramIndex++;
    }

    if (req.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      params.push(req.title);
      paramIndex++;
    }

    if (req.content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      params.push(req.content);
      paramIndex++;
    }

    if (req.pros !== undefined) {
      updates.push(`pros = $${paramIndex}`);
      params.push(req.pros);
      paramIndex++;
    }

    if (req.cons !== undefined) {
      updates.push(`cons = $${paramIndex}`);
      params.push(req.cons);
      paramIndex++;
    }

    if (req.usageDuration !== undefined) {
      updates.push(`usage_duration = $${paramIndex}`);
      params.push(req.usageDuration);
      paramIndex++;
    }

    if (req.businessSize !== undefined) {
      updates.push(`business_size = $${paramIndex}`);
      params.push(req.businessSize);
      paramIndex++;
    }

    if (req.useCase !== undefined) {
      updates.push(`use_case = $${paramIndex}`);
      params.push(req.useCase);
      paramIndex++;
    }

    if (req.wouldRecommend !== undefined) {
      updates.push(`would_recommend = $${paramIndex}`);
      params.push(req.wouldRecommend);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    // Add updated_at and status reset to pending for re-moderation
    updates.push(`updated_at = NOW()`);
    updates.push(`status = 'pending'`);

    // Add review ID as the last parameter
    params.push(req.reviewId);

    const updateQuery = `
      UPDATE reviews 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
    `;

    await reviewDB.rawExec(updateQuery, ...params);

    return { success: true };
  }
);
