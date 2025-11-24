export const bodyToReview = (body) => {
  return {
    assignedMissionId: body.assignedMissionId,
    rating: body.rating,
    body: body.body,
  };
};

const toNumber = (value) =>
  typeof value === "bigint" ? Number(value) : value;

export const responseFromReview = ({ review, user, store, mission }) => {
  return {
    reviewId: toNumber(review.id),
    assignedMissionId: toNumber(review.assignedMissionId),
    rating: toNumber(review.rating),
    body: review.body,
    createdAt: review.createdAt,
    user: {
      id: toNumber(user.id),
      name: user.name,
    },
    store: {
      id: toNumber(store.id),
      name: store.storeName,
    },
    mission: {
      id: toNumber(mission.id),
      description: mission.description,
      reward: toNumber(mission.reward),
    },
  };
};
