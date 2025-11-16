import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleCreateReview, handleGetMyReviews } from "./controllers/review.controller.js";
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

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan("dev")); // 요청 로깅

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/auth/signup", handleUserSignUp);
app.get("/api/v1/users/me/reviews", handleGetMyReviews);
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