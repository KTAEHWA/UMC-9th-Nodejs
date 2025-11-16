import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
  createUserWithPreferences,
  getUser,
  getUserPreferencesByUserId,
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

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};