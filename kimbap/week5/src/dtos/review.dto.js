export const bodyToReview = (body) => {
  return {
    assignedMissionId: body.assignedMissionId,
    rating: body.rating,
    body: body.body
  };
};

export const responseFromReview = ({ review, user, store, mission }) => {
  return {
    reviewId: review.id,
    assignedMissionId: review.assignedMissionId,
    rating: review.rating,
    body: review.body,
    createdAt: review.createdAt,
    user: {
      id: user.id,
      name: user.name
    },
    store: {
      id: store.id,
      name: store.storeName
    },
    mission: {
      id: mission.id,
      description: mission.description,
      reward: mission.reward
    }
  };
};
