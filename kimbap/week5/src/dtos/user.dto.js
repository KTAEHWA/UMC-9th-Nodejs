export const bodyToUser = (body) => {
    const birthdate = new Date(body.birth); //날짜 변환
  
    return {
      email: body.email || null,
      name: body.name, // 필수
      gender: body.gender, // 필수
      birthdate, // 필수
      address: body.address || "", //선택 
      preferences: body.preferences,// 필수 
    };
  };

export const responseFromUser = ({ user, preferences }) => {
  // user는 배열 형태이므로 첫 번째 요소를 가져옴
  const userData = user[0];
  
  // 선호 카테고리를 클라이언트가 이해하기 쉬운 형태로 변환
  const categoryList = preferences.map(pref => ({
    id: pref.categoryId,
    name: pref.category
  }));
  
  return {
    user: {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      gender: userData.gender,
      birthdate: userData.birthdate,
      address: userData.address,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    },
    preferences: categoryList
  };
};