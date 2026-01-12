import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";

import { errorCode } from "../../../config/errorCode";
import { createError } from "../../utils/error";
import { checkUserIfNotExist } from "../../utils/auth";
import { getUserbyId } from "../../services/authService";
import {
  createOneReview,
  getReviewsByProductId,
} from "../../services/reviewService";

interface CustomRequest extends Request {
  userId?: number;
}

/* review create */
export const createReview = [
  body("productId", "Product ID is required").isInt({ gt: 0 }),
  body("rating", "Rating must be between 1 and 5").isInt({ min: 1, max: 5 }),
  body("comment").optional().trim().escape(),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const user = await getUserbyId(req.userId!);
    checkUserIfNotExist(user);

    const { productId, rating, comment } = req.body;

    await createOneReview({
      productId,
      rating,
      comment,
      userId: user!.id,
    });

    res.status(201).json({
      message: "Review submitted successfully",
    });
  },
];

/* get a review */
export const getProductReviews = [
  param("productId", "Product ID is required").isInt({ gt: 0 }),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const productId = +req.params.productId;
    const reviews = await getReviewsByProductId(productId);

    res.status(200).json({
      message: "Product reviews",
      reviews,
    });
  },
];
