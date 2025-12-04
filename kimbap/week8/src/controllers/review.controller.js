import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview, getMyReviews, getMyReviewDetail, listStoreReviews } from "../services/review.service.js";

export const handleCreateReview = async (req, res, next) => {
  /*
    #swagger.summary = '리뷰 작성 API'
    #swagger.tags = ['Reviews']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              assignedMissionId: { type: "number", example: 101 },
              rating: { type: "number", example: 5 },
              body: { type: "string", example: "맛도리네여" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: '리뷰 작성 성공 응답',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  reviewId: { type: "number" },
                  assignedMissionId: { type: "number" },
                  rating: { type: "number" },
                  body: { type: "string" },
                  createdAt: { type: "string" },
                  user: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                  store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                  mission: { type: "object", properties: { id: { type: "number" }, description: { type: "string" }, reward: { type: "number" } } }
                }
              }
            }
          }
        }
      }
    }
  */
  console.log("리뷰 작성을 요청했습니다!");
  console.log("body:", req.body);

  try {
    const userId = 1;
    const review = await createReview(bodyToReview(req.body), userId);
    res.status(StatusCodes.CREATED).success(review);
  } catch (error) {
    next(error);
  }
};

export const handleGetMyReviews = async (req, res, next) => {
  /*
    #swagger.summary = '내 리뷰 목록 조회 API'
    #swagger.tags = ['Reviews']
    #swagger.responses[200] = {
      description: '내 리뷰 목록 조회 성공 응답',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  content: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        reviewId: { type: "number" },
                        assignedMissionId: { type: "number" },
                        rating: { type: "number" },
                        body: { type: "string" },
                        createdAt: { type: "string" },
                        user: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        mission: { type: "object", properties: { id: { type: "number" }, description: { type: "string" }, reward: { type: "number" } } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  console.log("내 리뷰 목록 조회를 요청했습니다!");

  try {
    const userId = 1;
    const reviews = await getMyReviews(userId);
    res.status(StatusCodes.OK).success({ content: reviews });
  } catch (error) {
    next(error);
  }
};

export const handleGetMyReviewDetail = async (req, res, next) => {
  /*
    #swagger.summary = '내 리뷰 단건 조회 API'
    #swagger.tags = ['Reviews']
    #swagger.parameters['reviewId'] = { in: 'path', required: true, schema: { type: 'number' }, example: 12 }
    #swagger.responses[200] = {
      description: '내 리뷰 단건 조회 성공 응답',
      content: { "application/json": { schema: { type: 'object', properties: {
        resultType: { type: 'string', example: 'SUCCESS' },
        error: { type: 'object', nullable: true, example: null },
        success: { $ref: '#/components/schemas/ReviewItemWithJoins' }
      } } } }
    }
    #swagger.responses[404] = {
      description: '리뷰가 존재하지 않거나 권한 없음',
      content: { "application/json": { schema: { type: 'object', properties: {
        resultType: { type: 'string', example: 'FAIL' },
        error: { $ref: '#/components/schemas/ErrorObject' },
        success: { type: 'object', nullable: true, example: null }
      } } } }
    }
  */
  try {
    const userId = 1;
    const reviewId = req.params.reviewId;
    const review = await getMyReviewDetail(userId, reviewId);
    res.status(StatusCodes.OK).success(review);
  } catch (error) {
    if (error.code === "REVIEW_NOT_FOUND") {
      return res.status(StatusCodes.NOT_FOUND).error({ errorCode: "REVIEW_NOT_FOUND", reason: error.message });
    }
    next(error);
  }
};

export const handleGetStoreReviews = async (req, res, next) => {
  /*
    #swagger.summary = '스토어 리뷰 목록 조회 API(커서 기반)'
    #swagger.tags = ['Reviews']
    #swagger.parameters['storeId'] = { in: 'path', required: true, schema: { type: 'number' }, example: 1 }
    #swagger.parameters['cursor'] = { in: 'query', required: false, schema: { type: 'number' } }
    #swagger.parameters['limit'] = { in: 'query', required: false, schema: { type: 'number', default: 10 } }
    #swagger.responses[200] = {
      description: '스토어 리뷰 목록 조회 성공 응답',
      content: { "application/json": { schema: { type: 'object', properties: {
        resultType: { type: 'string', example: 'SUCCESS' },
        error: { type: 'object', nullable: true, example: null },
        success: { type: 'object', properties: {
          content: { type: 'array', items: { $ref: '#/components/schemas/ReviewItemWithJoins' } },
          nextCursor: { type: 'number', nullable: true }
        } }
      } } } }
    }
  */
  try {
    const { storeId } = req.params;
    const { cursor, limit } = req.query;
    const data = await listStoreReviews(storeId, { cursor, limit: limit ? Number(limit) : 10 });
    res.status(StatusCodes.OK).success(data);
  } catch (error) {
    next(error);
  }
};
