import { prisma } from "../db.config.js";

const toBigInt = (value, fieldName) => {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName}는 필수 값입니다.`);
  }

  return typeof value === "bigint" ? value : BigInt(value);
};

const toDate = (value, fieldName) => {
  if (value instanceof Date) {
    return value;
  }

  if (value === undefined || value === null) {
    throw new Error(`${fieldName}는 필수 값입니다.`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName}가 올바른 날짜가 아닙니다.`);
  }

  return date;
};

const toBigIntArray = (values, fieldName) => {
  if (!Array.isArray(values)) {
    throw new Error(`${fieldName}는 배열이어야 합니다.`);
  }

  return values.map((v) => toBigInt(v, fieldName));
};

// User 데이터 삽입 (단독)
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });

  if (user) {
    return null;
  }

  const points =
    data.points === undefined || data.points === null
      ? 0n
      : typeof data.points === "bigint"
      ? data.points
      : BigInt(data.points);
  const birthdate = toDate(data.birthdate, "birthdate");

  const created = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birthdate,
      address: data.address,
      points,
    },
  });

  return created.id;
};

// 사용자 + 선호 카테고리 트랜잭션 생성
export const createUserWithPreferences = async (data, preferenceIds) => {
  const exists = await prisma.user.findFirst({ where: { email: data.email } });
  if (exists) {
    return null;
  }

  const points =
    data.points === undefined || data.points === null
      ? 0n
      : typeof data.points === "bigint"
      ? data.points
      : BigInt(data.points);
  const birthdate = toDate(data.birthdate, "birthdate");

  const uniquePreferenceIds = Array.from(new Set(preferenceIds ?? []));
  const bigIntPreferenceIds = uniquePreferenceIds.length
    ? toBigIntArray(uniquePreferenceIds, "preferenceIds")
    : [];

  return await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: data.email,
        name: data.name,
        gender: data.gender,
        birthdate,
        address: data.address,
        points,
      },
    });

    if (bigIntPreferenceIds.length > 0) {
      const categories = await tx.category.findMany({
        where: { id: { in: bigIntPreferenceIds } },
        select: { id: true },
      });

      if (categories.length !== bigIntPreferenceIds.length) {
        throw new Error("존재하지 않는 카테고리 ID가 포함되어 있습니다.");
      }

      await tx.foodPreference.createMany({
        data: bigIntPreferenceIds.map((categoryId) => ({
          userId: created.id,
          categoryId,
        })),
        skipDuplicates: true,
      });
    }

    return created.id;
  });
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const id = toBigInt(userId, "userId");
  return prisma.user.findUniqueOrThrow({
    where: { id },
  });
};

// 음식 선호 카테고리 매핑 (단건)
export const setPreference = async (userId, foodCategoryId) => {
  const id = toBigInt(userId, "userId");
  const categoryId = toBigInt(foodCategoryId, "foodCategoryId");

  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) {
    throw new Error("존재하지 않는 카테고리입니다.");
  }

  await prisma.foodPreference.create({
    data: {
      userId: id,
      categoryId,
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const id = toBigInt(userId, "userId");

  return prisma.foodPreference.findMany({
    select: {
      id: true,
      userId: true,
      categoryId: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    where: { userId: id },
    orderBy: { categoryId: "asc" },
  });
};

export const updateUser = async (userId, data) => {
  const id = toBigInt(userId, "userId");

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.gender !== undefined) updateData.gender = data.gender;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.birthdate !== undefined) updateData.birthdate = toDate(data.birthdate, "birthdate");

  if (Object.keys(updateData).length === 0) {
    return await prisma.user.findUnique({ where: { id } });
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
};
