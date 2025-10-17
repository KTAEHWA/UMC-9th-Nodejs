import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";

export const handleCreateReview = async (req, res, next) => {
  console.log("리뷰 작성을 요청했습니다!");
  console.log("body:", req.body);

  try {
    // 실제 환경에서는 JWT 토큰에서 userId를 추출해야 함
    // 현재는 테스트를 위해 하드코딩
    const userId = 1; // TODO: JWT 토큰에서 추출

    const review = await createReview(bodyToReview(req.body), userId);
    
    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      error: null,
      result: review
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      isSuccess: false,
      error: error.message,
      result: null
    });
  }
};
