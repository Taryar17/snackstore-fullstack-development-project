import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import {
  createType,
  getTypeById,
  getTypeList,
  updateType,
  deleteType,
} from "../../services/typeService";
import { checkModelIfExist } from "../../utils/check";
import cacheQueue from "../../jobs/queues/cacheQueue";

export const listTypes = async (_: Request, res: Response) => {
  const types = await getTypeList();
  res.json(types);
};

export const getType = [
  param("typeId").isInt({ gt: 0 }),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const type = await getTypeById(+req.params.typeId);
    checkModelIfExist(type);

    res.status(200).json({ type });
  },
];

export const storeType = [
  body("name").trim().notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const type = await createType(req.body);

    await cacheQueue.add("invalidate-type-cache", {
      pattern: "categories:*",
    });

    res.status(201).json({
      message: "Type created successfully",
      typeId: type.id,
    });
  },
];

export const updateTypeById = [
  param("typeId").isInt({ gt: 0 }),
  body("name").trim().notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    await updateType(+req.params.typeId, req.body);

    await cacheQueue.add("invalidate-type-cache", {
      pattern: "types:*",
    });

    res.status(200).json({ message: "Type updated" });
  },
];

export const removeType = [
  param("typeId").isInt({ gt: 0 }),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const type = await getTypeById(+req.params.typeId);
    checkModelIfExist(type);

    await deleteType(type!.id);

    await cacheQueue.add("invalidate-type-cache", {
      pattern: "types:*",
    });

    res.status(200).json({ message: "Type deleted" });
  },
];
