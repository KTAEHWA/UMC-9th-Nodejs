import { prisma } from "../db.config.js";

const toBigInt = (value, fieldName) => {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName}는 필수 값입니다.`);
  }

  return typeof value === "bigint" ? value : BigInt(value);
};

// 미션 추가
export const addMission = async (data) => {
  const storeId = toBigInt(data.storeId, "storeId");
  const reward = toBigInt(data.reward, "reward");

  const created = await prisma.missionTemplate.create({
    data: {
      storeId,
      reward,
      description: data.description,
      isActive: data.isActive ?? true,
    },
  });

  return created.id;
};

// 미션 조회
export const getMission = async (missionId) => {
  const id = toBigInt(missionId, "missionId");

  return prisma.missionTemplate.findUnique({
    where: { id },
  });
};

// 가게 존재 여부 검증
export const validateStore = async (storeId) => {
  const id = toBigInt(storeId, "storeId");

  const store = await prisma.store.findUnique({
    where: { id },
    select: { id: true },
  });

  return store !== null;
};

// 미션 활성화 여부 및 존재 확인
export const validateActiveMission = async (missionId) => {
  const id = toBigInt(missionId, "missionId");

  return prisma.missionTemplate.findFirst({
    where: {
      id,
      isActive: true,
    },
  });
};

// 사용자가 이미 해당 미션을 도전했는지 확인
export const checkExistingChallenge = async (userId, missionId) => {
  const uid = toBigInt(userId, "userId");
  const mid = toBigInt(missionId, "missionId");

  const challenge = await prisma.missionAssigned.findFirst({
    where: {
      userId: uid,
      missionId: mid,
    },
  });

  return challenge !== null;
};

// 미션 도전 (MissionAssigned에 추가)
export const assignMission = async (userId, missionId) => {
  const uid = toBigInt(userId, "userId");
  const mid = toBigInt(missionId, "missionId");

  const assigned = await prisma.missionAssigned.create({
    data: {
      userId: uid,
      missionId: mid,
      status: "assigned",
    },
  });

  return assigned.id;
};

// 할당된 미션 조회
export const getAssignedMission = async (assignedMissionId) => {
  const id = toBigInt(assignedMissionId, "assignedMissionId");

  return prisma.missionAssigned.findUnique({
    where: { id },
  });
};

// 특정 스토어 기본 정보 조회
export const getStoreInfo = async (storeId) => {
  const id = toBigInt(storeId, "storeId");

  return prisma.store.findUnique({
    where: { id },
    select: {
      id: true,
      storeName: true,
      category: { select: { name: true } },
      region: { select: { regionName: true } },
    },
  });
};

// 특정 스토어 미션 목록 (커서 기반)
export const getStoreMissions = async (storeId, { cursor, limit = 10, isActive = true } = {}) => {
  const id = toBigInt(storeId, "storeId");

  const where = {
    storeId: id,
    ...(String(isActive) === "false" ? {} : { isActive: true }),
  };

  const query = {
    where,
    orderBy: { id: "asc" },
    take: Number(limit) || 10,
  };

  if (cursor !== undefined && cursor !== null && cursor !== "") {
    const cur = toBigInt(cursor, "cursor");
    Object.assign(query, { cursor: { id: cur }, skip: 1 });
  }

  return prisma.missionTemplate.findMany(query);
};

// 사용자 미션 목록 (상태 필터 선택)
export const getUserMissions = async (userId, { status } = {}) => {
  const uid = toBigInt(userId, "userId");

  return prisma.missionAssigned.findMany({
    where: {
      userId: uid,
      ...(status ? { status } : {}),
    },
    orderBy: { id: "desc" },
    include: {
      mission: {
        include: {
          store: true,
        },
      },
    },
  });
};

// 사용자 미션 완료 처리 (트랜잭션)
export const completeUserMission = async (userId, assignedMissionId) => {
  const uid = toBigInt(userId, "userId");
  const aid = toBigInt(assignedMissionId, "assignedMissionId");

  return prisma.$transaction(async (tx) => {
    const assigned = await tx.missionAssigned.findFirst({
      where: { id: aid, userId: uid },
      include: { mission: true },
    });

    if (!assigned) {
      const err = new Error("존재하지 않는 사용자 미션입니다.");
      err.code = "USER_MISSION_NOT_FOUND";
      throw err;
    }

    if (assigned.status === "completed") {
      const err = new Error("이미 완료된 미션입니다.");
      err.code = "ALREADY_COMPLETED";
      throw err;
    }

    const updated = await tx.missionAssigned.update({
      where: { id: assigned.id },
      data: { status: "completed", completedAt: new Date() },
    });

    const reward = assigned.mission.reward;

    const user = await tx.user.update({
      where: { id: uid },
      data: { points: { increment: reward } },
      select: { points: true },
    });

    return { updated, reward, userPoints: user.points };
  });
};
