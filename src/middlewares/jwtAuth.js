import { expressjwt } from "express-jwt";
import reviewRepository from "../repositories/reviewRepository.js";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
  // req.auth 객체에 할당
});

async function verifyReview(req, res, next) {
  const { id: reviewId } = req.params;
  const { userId } = req.user;

  try {
    const review = await reviewRepository.getById(reviewId);
    if (!review) {
      const error = new Error("review not found");
      error.code = 404;
      throw error;
    }
    if (review.authorId !== userId) {
      const error = new Error("forbidden");
      error.code = 403;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifyAccessToken,
  verifyReview,
  verifyRefreshToken,
};
