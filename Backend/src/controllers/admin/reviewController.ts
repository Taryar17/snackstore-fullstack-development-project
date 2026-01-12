import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { ReviewStatus } from "../../../generated/prisma/enums";

import { errorCode } from "../../../config/errorCode";
import { createError } from "../../utils/error";
import {
  getAllReviews,
  updateReviewStatus,
  deleteOneReview,
} from "../../services/reviewService";

/* GET ALL REVIEWS */
export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reviews = await getAllReviews();

  res.status(200).json({
    message: "All reviews",
    reviews,
  });
};

/* UPDATE REVIEW STATUS */
export const changeReviewStatus = [
  body("reviewId", "Review ID is required").isInt({ gt: 0 }),
  body("status", "Invalid status").isIn([
    ReviewStatus.ACTIVE,
    ReviewStatus.HIDDEN,
  ]),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { reviewId, status } = req.body;

    await updateReviewStatus(reviewId, status);

    res.status(200).json({
      message: "Review status updated",
    });
  },
];

/* DELETE REVIEW */
export const deleteReview = [
  body("reviewId", "Review ID is required").isInt({ gt: 0 }),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    await deleteOneReview(req.body.reviewId);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  },
];
