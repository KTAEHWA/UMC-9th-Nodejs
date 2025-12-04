import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError, DataMappingError } from "../errors.js";
import {
  createUserWithPreferences,
  getUser,
  getUserPreferencesByUserId,
  updateUser,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const joinUserId = await createUserWithPreferences(
    {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birthdate: data.birthdate,
      address: data.address,
      points: data.points,
    },
    data.preferences ?? []
  );

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  try {
    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);
    return responseFromUser({ user, preferences });
  } catch (err) {
    throw new DataMappingError("사용자/선호 데이터 매핑 중 오류가 발생했습니다.", {
      userId: joinUserId,
      input: {
        email: data.email,
        name: data.name,
        gender: data.gender,
        birthdate: data.birthdate,
        address: data.address,
        preferences: data.preferences ?? [],
      },
      cause: err?.message,
    });
  }
};

export const updateMyProfile = async (userId, data) => {
  const updated = await updateUser(userId, data);
  return {
    id: Number(updated.id),
    email: updated.email,
    name: updated.name,
    gender: updated.gender,
    birthdate: updated.birthdate,
    address: updated.address,
    points: Number(updated.points),
  };
};