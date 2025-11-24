import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { handleUserSignUp, handleUpdateMyProfile } from "./controllers/user.controller.js";
import { handleCreateReview, handleGetMyReviews, handleGetMyReviewDetail, handleGetStoreReviews } from "./controllers/review.controller.js";
import { handleCreateMission, handleChallengeMission, handleGetStoreMissions, handleGetMyMissions, handleCompleteMyMission } from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

/**
 * 공통 응답 헬퍼 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };
  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };
  next();
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Swagger UI 및 OpenAPI JSON 엔드포인트
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  try {
    const options = {
      openapi: "3.0.0",
      disableLogs: true,
      writeOutputFile: false,
    };
    const outputFile = "/dev/null";
    const routes = ["./src/index.js"];
    const doc = {
      info: {
        title: "UMC 9th",
        description: "UMC 9th Node.js 테스트 프로젝트입니다.",
      },
      host: "localhost:3000",
      components: {
        schemas: {
          ErrorObject: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U001" },
              reason: { type: "string", example: "이미 존재하는 이메일입니다." },
              data: { type: "object" }
            }
          },
          UserSignupResult: {
            type: "object",
            properties: {
              email: { type: "string" },
              name: { type: "string" },
              preferCategory: { type: "array", items: { type: "string" } }
            }
          },
          StoreInfo: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              category: { type: "string", nullable: true },
              region: { type: "string", nullable: true }
            }
          },
          MissionItem: {
            type: "object",
            properties: {
              id: { type: "number" },
              description: { type: "string" },
              reward: { type: "number" },
              isActive: { type: "boolean" },
              createdAt: { type: "string" }
            }
          },
          ReviewItemWithJoins: {
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
          },
          MyMissionItem: {
            type: "object",
            properties: {
              userMissionId: { type: "number" },
              status: { type: "string" },
              assignedAt: { type: "string" },
              completedAt: { type: "string", nullable: true },
              mission: { type: "object", properties: { id: { type: "number" }, description: { type: "string" }, reward: { type: "number" } } },
              store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } }
            }
          },
          MissionCompleteResult: {
            type: "object",
            properties: {
              MissionId: { type: "number" },
              status: { type: "string", example: "COMPLETED" },
              assignedAt: { type: "string" },
              completedAt: { type: "string" },
              reward: { type: "number" },
              userPoints: { type: "number" }
            }
          },
          PaginationCursor: {
            type: "object",
            properties: {
              cursor: { type: "number", nullable: true }
            }
          }
        }
      }
    };
    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  // #swagger.ignore = true
  res.send("Hello World!");
});

app.post("/api/v1/auth/signup", handleUserSignUp);
app.patch("/api/v1/users/me", handleUpdateMyProfile);
app.get("/api/v1/users/me/reviews", handleGetMyReviews);
app.get("/api/v1/users/me/reviews/:reviewId", handleGetMyReviewDetail);
app.get("/api/v1/stores/:storeId/reviews", handleGetStoreReviews);
app.post("/api/v1/users/me/reviews", handleCreateReview);
app.post("/api/v1/missions", handleCreateMission);
app.post("/api/v1/missions/:missionId", handleChallengeMission);
app.get("/api/v1/stores/:storeId/missions", handleGetStoreMissions);
app.get("/api/v1/users/me/missions", handleGetMyMissions);
app.post("/api/v1/users/me/missions/:assignedMissionId/complete", handleCompleteMyMission);

/**
 * 전역 오류 처리기
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusMap = {
    STORE_NOT_FOUND: 404,
    USER_MISSION_NOT_FOUND: 404,
    ALREADY_COMPLETED: 400,
    DUPLICATE_USER_EMAIL: 400,
    U001: 400,
    U100: 500,
  };

  const errorCode = err.errorCode || err.code || "unknown";
  const statusCode = err.statusCode || statusMap[errorCode] || 500;

  res.status(statusCode).error({
    errorCode,
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});