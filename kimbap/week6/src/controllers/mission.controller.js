import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission, challengeMission, listStoreMissions, listMyMissions, completeMyMission } from "../services/mission.service.js";

export const handleCreateMission = async (req, res, next) => {
  console.log("미션 생성을 요청했습니다!");
  console.log("body:", req.body);

  try {
    const mission = await createMission(bodyToMission(req.body));
    
    res.status(StatusCodes.CREATED).success(mission);
  } catch (error) {
    next(error);
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
    
    res.status(StatusCodes.CREATED).success(assignedMission);
  } catch (error) {
    next(error);
  }
};

export const handleGetStoreMissions = async (req, res, next) => {
  console.log("스토어 미션 목록을 요청했습니다!", req.params, req.query);

  try {
    const storeId = req.params.storeId;
    const { cursor, limit, isActive } = req.query;

    const data = await listStoreMissions({ storeId, cursor, limit: limit ? Number(limit) : 10, isActive });

    res.status(StatusCodes.OK).success(data);
  } catch (error) {
    next(error);
  }
};

export const handleGetMyMissions = async (req, res, next) => {
  console.log("내 진행/완료 미션 목록을 요청했습니다!", req.query);

  try {
    // TODO: JWT 연동 후 교체
    const userId = 1;
    const { status } = req.query; // "IN_PROGRESS" | "COMPLETE" | undefined

    const data = await listMyMissions({ userId, status });

    res.status(StatusCodes.OK).success(data);
  } catch (error) {
    next(error);
  }
};

export const handleCompleteMyMission = async (req, res, next) => {
  console.log("내 미션 완료 처리를 요청했습니다!", req.params);

  try {
    // TODO: JWT 연동 후 교체
    const userId = 1;
    const assignedMissionId = req.params.assignedMissionId;

    const result = await completeMyMission({ userId, assignedMissionId });

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};
