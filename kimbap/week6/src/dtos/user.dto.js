export const bodyToUser = (body) => {
  const birthInput = body.birthdate ?? body.birth;

  if (!birthInput) {
    throw new Error("birthdate는 필수 값입니다.");
  }

  const birthdate = birthInput instanceof Date ? birthInput : new Date(birthInput);

  if (Number.isNaN(birthdate.getTime())) {
    throw new Error("유효하지 않은 birthdate 값입니다.");
  }

  const preferences = Array.isArray(body.preferences)
    ? body.preferences
    : body.preferences !== undefined && body.preferences !== null
    ? [body.preferences]
    : [];

  return {
    email: body.email || null,
    name: body.name, // 필수
    gender: body.gender, // 필수
    birthdate, // 필수
    address: body.address || "", //선택
    preferences,
  };
};

export const responseFromUser = ({ user, preferences }) => {
  const preferFoods = preferences.map(
    (preference) => preference.category.name
  );

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
};