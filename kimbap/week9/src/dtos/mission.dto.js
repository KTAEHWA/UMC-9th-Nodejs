export const bodyToMission = (body) => {
  return {
    storeId: body.storeId,
    reward: body.reward,
    description: body.description,
    isActive: body.isActive !== undefined ? body.isActive : true
  };
};

const toNumber = (value) =>
  typeof value === "bigint" ? Number(value) : value;

export const responseFromMission = (mission) => {
  return {
    missionId: toNumber(mission.id),
    storeId: toNumber(mission.storeId),
    reward: toNumber(mission.reward),
    description: mission.description,
    isActive: mission.isActive,
    createdAt: mission.createdAt
  };
};

export const responseFromAssignedMission = (assignedMission) => {
  return {
    assignedMissionId: toNumber(assignedMission.id),
    missionId: toNumber(assignedMission.missionId),
    userId: toNumber(assignedMission.userId),
    status: assignedMission.status,
    assignedAt: assignedMission.assignedAt
  };
};
