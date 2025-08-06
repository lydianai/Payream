import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { reviewDB } from "./db";

export interface VoteReviewRequest {
  reviewId: string;
  voteType: string; // 'helpful' or 'unhelpful'
}

// Votes on a review as helpful or unhelpful.
export const voteReview = api<VoteReviewRequest, { success: boolean }>(
  { auth: true, expose: true, method: "POST", path: "/reviews/:reviewId/vote" },
  async (req) => {
    const auth = getAuthData()!;

    // Validate vote type
    if (!['helpful', 'unhelpful'].includes(req.voteType)) {
      throw APIError.invalidArgument("voteType must be 'helpful' or 'unhelpful'");
    }

    // Check if review exists and is approved
    const review = await reviewDB.queryRow`
      SELECT id, user_id FROM reviews 
      WHERE id = ${req.reviewId} AND status = 'approved'
    `;

    if (!review) {
      throw APIError.notFound("review not found or not approved");
    }

    // Users cannot vote on their own reviews
    if (review.user_id === auth.userID) {
      throw APIError.invalidArgument("cannot vote on your own review");
    }

    // Begin transaction
    await reviewDB.exec`BEGIN`;

    try {
      // Check if user has already voted
      const existingVote = await reviewDB.queryRow`
        SELECT vote_type FROM review_votes 
        WHERE review_id = ${req.reviewId} AND user_id = ${auth.userID}
      `;

      if (existingVote) {
        // If same vote type, remove the vote
        if (existingVote.vote_type === req.voteType) {
          await reviewDB.exec`
            DELETE FROM review_votes 
            WHERE review_id = ${req.reviewId} AND user_id = ${auth.userID}
          `;

          // Update review counts
          if (req.voteType === 'helpful') {
            await reviewDB.exec`
              UPDATE reviews 
              SET helpful_count = helpful_count - 1 
              WHERE id = ${req.reviewId}
            `;
          } else {
            await reviewDB.exec`
              UPDATE reviews 
              SET unhelpful_count = unhelpful_count - 1 
              WHERE id = ${req.reviewId}
            `;
          }
        } else {
          // Change vote type
          await reviewDB.exec`
            UPDATE review_votes 
            SET vote_type = ${req.voteType}, created_at = NOW()
            WHERE review_id = ${req.reviewId} AND user_id = ${auth.userID}
          `;

          // Update review counts
          if (req.voteType === 'helpful') {
            await reviewDB.exec`
              UPDATE reviews 
              SET helpful_count = helpful_count + 1, unhelpful_count = unhelpful_count - 1 
              WHERE id = ${req.reviewId}
            `;
          } else {
            await reviewDB.exec`
              UPDATE reviews 
              SET helpful_count = helpful_count - 1, unhelpful_count = unhelpful_count + 1 
              WHERE id = ${req.reviewId}
            `;
          }
        }
      } else {
        // Create new vote
        await reviewDB.exec`
          INSERT INTO review_votes (review_id, user_id, vote_type)
          VALUES (${req.reviewId}, ${auth.userID}, ${req.voteType})
        `;

        // Update review counts
        if (req.voteType === 'helpful') {
          await reviewDB.exec`
            UPDATE reviews 
            SET helpful_count = helpful_count + 1 
            WHERE id = ${req.reviewId}
          `;
        } else {
          await reviewDB.exec`
            UPDATE reviews 
            SET unhelpful_count = unhelpful_count + 1 
            WHERE id = ${req.reviewId}
          `;
        }
      }

      await reviewDB.exec`COMMIT`;

      return { success: true };
    } catch (error) {
      await reviewDB.exec`ROLLBACK`;
      throw error;
    }
  }
);
