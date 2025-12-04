export const bodyToMission = (body) => {
  return {
    storeId: body.storeId,
    reward: body.reward,
    description: body.description,
    isActive: body.isActive !== undefined ? body.isActive : true
  };
};

export const responseFromMission = (mission) => {
  return {
    missionId: mission.id,
    storeId: mission.storeId,
    reward: mission.reward,
    description: mission.description,
    isActive: mission.isActive,
    createdAt: mission.createdAt
  };
};

export const responseFromAssignedMission = (assignedMission) => {
  return {
    assignedMissionId: assignedMission.id,
    missionId: assignedMission.missionId,
    userId: assignedMission.userId,
    status: assignedMission.status,
    assignedAt: assignedMission.assignedAt
  };
};
