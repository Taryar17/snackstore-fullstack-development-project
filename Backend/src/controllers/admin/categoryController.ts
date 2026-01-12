import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { createError } from "../../utils/error";
import { checkModelIfExist } from "../../utils/check";
import cacheQueue from "../../jobs/queues/cacheQueue";
import {
  createOneCategory,
  getAllCategories,
  getCategoryById,
  updateOneCategory,
  deleteOneCategory,
} from "../../services/categoryService";

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await getAllCategories();
  res.status(200).json({ categories });
};

export const getCategoryDetail = [
  param("categoryId").isInt({ gt: 0 }),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const category = await getCategoryById(+req.params.categoryId);
    checkModelIfExist(category);

    res.status(200).json({ category });
  },
];

export const createCategory = [
  body("name").trim().notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const category = await createOneCategory(req.body);

    await cacheQueue.add("invalidate-category-cache", {
      pattern: "categories:*",
    });

    res.status(201).json({
      message: "Category created successfully",
      categoryId: category.id,
    });
  },
];

export const updateCategory = [
  param("categoryId").isInt({ gt: 0 }),
  body("name").trim().notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    await updateOneCategory(+req.params.categoryId, req.body);

    await cacheQueue.add("invalidate-category-cache", {
      pattern: "categories:*",
    });

    res.status(200).json({ message: "Category updated" });
  },
];

export const deleteCategory = [
  param("categoryId").isInt({ gt: 0 }),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const category = await getCategoryById(+req.params.categoryId);
    checkModelIfExist(category);

    await deleteOneCategory(category!.id);

    await cacheQueue.add("invalidate-category-cache", {
      pattern: "categories:*",
    });

    res.status(200).json({ message: "Category deleted" });
  },
];
