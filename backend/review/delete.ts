import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { reviewDB } from "./db";

// Deletes a review (only by the author).
export const deleteReview = api<{ reviewId: string }, { success: boolean }>(
  { auth: true, expose: true, method: "DELETE", path: "/reviews/:reviewId" },
  async (req) => {
    const auth = getAuthData()!;

    // Check if review exists and belongs to the user
    const review = await reviewDB.queryRow`
      SELECT id FROM reviews 
      WHERE id = ${req.reviewId} AND user_id = ${auth.userID}
    `;

    if (!review) {
      throw APIError.notFound("review not found or you don't have permission to delete it");
    }

    // Delete the review (cascade will handle votes and reports)
    await reviewDB.exec`
      DELETE FROM reviews WHERE id = ${req.reviewId}
    `;

    return { success: true };
  }
);
