import { responseFromMission, responseFromAssignedMission } from "../dtos/mission.dto.js";
import {
  addMission,
  getMission,
  validateStore,
  validateActiveMission,
  checkExistingChallenge,
  assignMission,
  getAssignedMission
} from "../repositories/mission.repository.js";

export const createMission = async (data) => {
  // 가게가 존재하는지 검증
  const storeExists = await validateStore(data.storeId);
  
  if (!storeExists) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  // 미션 추가
  const missionId = await addMission({
    storeId: data.storeId,
    reward: data.reward,
    description: data.description,
    isActive: data.isActive
  });

  // 추가된 미션 조회
  const mission = await getMission(missionId);

  return responseFromMission(mission);
};

export const challengeMission = async (missionId, userId) => {
  // 미션이 존재하고 활성화되어 있는지 확인
  const mission = await validateActiveMission(missionId);
  
  if (!mission) {
    throw new Error("존재하지 않거나 비활성화된 미션입니다.");
  }

  // 사용자가 이미 해당 미션을 도전했는지 확인
  const alreadyChallenged = await checkExistingChallenge(userId, missionId);
  
  if (alreadyChallenged) {
    throw new Error("이미 도전한 미션입니다.");
  }

  // 미션 도전 (MissionAssigned에 추가)
  const assignedMissionId = await assignMission(userId, missionId);

  // 할당된 미션 조회
  const assignedMission = await getAssignedMission(assignedMissionId);

  return responseFromAssignedMission(assignedMission);
};
