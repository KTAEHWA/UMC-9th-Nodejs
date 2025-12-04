import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission, challengeMission } from "../services/mission.service.js";

export const handleCreateMission = async (req, res, next) => {
  console.log("미션 생성을 요청했습니다!");
  console.log("body:", req.body);

  try {
    const mission = await createMission(bodyToMission(req.body));
    
    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      error: null,
      result: mission
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      isSuccess: false,
      error: error.message,
      result: null
    });
  }
};

export const handleChallengeMission = async (req, res, next) => {
  console.log("미션 도전을 요청했습니다!");
  console.log("missionId:", req.params.missionId);

  try {
    // 실제 환경에서는 JWT 토큰에서 userId를 추출해야 함
    // 현재는 테스트를 위해 하드코딩
    const userId = 1; // TODO: JWT 토큰에서 추출
    const missionId = parseInt(req.params.missionId);

    const assignedMission = await challengeMission(missionId, userId);
    
    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      error: null,
      result: assignedMission
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      isSuccess: false,
      error: error.message,
      result: null
    });
  }
};
