import { responseFromReview } from "../dtos/review.dto.js";
import {
  addReview,
  getReviewWithDetails,
  validateAssignedMission
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
