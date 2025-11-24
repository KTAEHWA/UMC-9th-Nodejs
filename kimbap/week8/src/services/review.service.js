import { responseFromReview } from "../dtos/review.dto.js";
import {
  addReview,
  getReviewWithDetails,
  validateAssignedMission,
  getReviewsByUserId,
  getMyReviewById,
  getStoreReviews,
} from "../repositories/review.repository.js";

export const createReview = async (data, userId) => {
  // 할당된 미션이 존재하고 완료된 상태인지 검증
  const assignedMission = await validateAssignedMission(data.assignedMissionId, userId);
  
  if (!assignedMission) {
    throw new Error("완료된 미션이 아니거나 접근 권한이 없습니다.");
  }

  // 리뷰 추가
  const reviewId = await addReview({
    assignedMissionId: data.assignedMissionId,
    rating: data.rating,
    body: data.body
  });

  // 추가된 리뷰와 관련 정보 조회
  const reviewDetails = await getReviewWithDetails(reviewId);

  return responseFromReview(reviewDetails);
};

export const getMyReviews = async (userId) => {
  const rows = await getReviewsByUserId(userId);
  return rows.map((row) => responseFromReview(row));
};

export const getMyReviewDetail = async (userId, reviewId) => {
  const row = await getMyReviewById(userId, reviewId);
  if (!row) {
    const err = new Error("존재하지 않는 리뷰입니다.");
    err.code = "REVIEW_NOT_FOUND";
    throw err;
  }
  return responseFromReview(row);
};

export const listStoreReviews = async (storeId, { cursor, limit = 10 } = {}) => {
  const rows = await getStoreReviews(storeId, { cursor, limit });
  const content = rows.map((row) => responseFromReview(row));
  const nextCursor = rows.length ? Number(rows[rows.length - 1].review.id) : null;
  return { content, nextCursor };
};
