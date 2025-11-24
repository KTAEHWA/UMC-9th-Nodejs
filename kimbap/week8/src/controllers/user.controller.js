import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, updateMyProfile } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API'
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "test@example.com" },
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "MALE" },
              birthdate: { type: "string", format: "date", example: "2000-01-23" },
              address: { type: "string", example: "서울시 강남구" },
              preferences: { type: "array", items: { type: "number" }, example: [1,3] }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '회원 가입 성공 응답',
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
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: '회원 가입 실패 응답',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string", example: "이미 존재하는 이메일입니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body);

  try {
    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).success(user);
  } catch (err) {
    next(err);
  }
};

export const handleUpdateMyProfile = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 정보 수정 API'
    #swagger.tags = ['Users']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "MALE" },
              birthdate: { type: "string", format: "date", example: "2000-01-23" },
              address: { type: "string", example: "서울시 강남구" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '사용자 정보 수정 성공 응답',
      content: { "application/json": { schema: { type: 'object', properties: {
        resultType: { type: 'string', example: 'SUCCESS' },
        error: { type: 'object', nullable: true, example: null },
        success: { type: 'object', properties: {
          id: { type: 'number' },
          email: { type: 'string' },
          name: { type: 'string' },
          gender: { type: 'string' },
          birthdate: { type: 'string' },
          address: { type: 'string' },
          points: { type: 'number' }
        } }
      } } } }
    }
  */
  try {
    const userId = 1;
    const profile = await updateMyProfile(userId, req.body);
    res.status(StatusCodes.OK).success(profile);
  } catch (err) {
    next(err);
  }
};