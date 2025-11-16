import { prisma } from "../db.config.js";

const toBigInt = (value, fieldName) => {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName}는 필수 값입니다.`);
  }

  return typeof value === "bigint" ? value : BigInt(value);
};

// 리뷰 추가
export const addReview = async (data) => {
  const assignedMissionId = toBigInt(data.assignedMissionId, "assignedMissionId");
  const rating = toBigInt(data.rating, "rating");

  const created = await prisma.review.create({
    data: {
      assignedMissionId,
      rating,
      body: data.body ?? null,
    },
  });

  return created.id;
};

// 리뷰 정보와 관련 데이터 조회
export const getReviewWithDetails = async (reviewId) => {
  const id = toBigInt(reviewId, "reviewId");

  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      missionAssigned: {
        include: {
          user: true,
          mission: {
            include: {
              store: true,
            },
          },
        },
      },
    },
  });

  if (!review) {
    return null;
  }

  const { missionAssigned } = review;

  return {
    review,
    user: missionAssigned.user,
    store: missionAssigned.mission.store,
    mission: missionAssigned.mission,
  };
};

// 내 리뷰 목록 조회
export const getReviewsByUserId = async (userId) => {
  const uid = toBigInt(userId, "userId");

  const reviews = await prisma.review.findMany({
    where: {
      missionAssigned: {
        userId: uid,
      },
    },
    orderBy: { id: "desc" },
    include: {
      missionAssigned: {
        include: {
          user: true,
          mission: {
            include: {
              store: true,
            },
          },
        },
      },
    },
  });

  return reviews.map((r) => ({
    review: r,
    user: r.missionAssigned.user,
    store: r.missionAssigned.mission.store,
    mission: r.missionAssigned.mission,
  }));
};

// 할당된 미션 검증
export const validateAssignedMission = async (assignedMissionId, userId) => {
  const id = toBigInt(assignedMissionId, "assignedMissionId");
  const uid = toBigInt(userId, "userId");

  return prisma.missionAssigned.findFirst({
    where: {
      id,
      userId: uid,
      status: "completed",
    },
    include: {
      mission: {
        include: {
          store: true,
        },
      },
    },
  });
};
