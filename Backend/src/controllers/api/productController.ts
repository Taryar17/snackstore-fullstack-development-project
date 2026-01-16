import { Request, Response, NextFunction } from "express";
import { body, query, param, validationResult } from "express-validator";

import { errorCode } from "../../../config/errorCode";
import { checkUserIfNotExist } from "../../utils/auth";
import { checkModelIfExist, checkUploadFile } from "../../utils/check";
import { createError } from "../../utils/error";
import { getUserbyId } from "../../services/authService";
import { getOrSetCache } from "../../utils/cache";
import {
  getCategoryList,
  getProductsList,
  getProductWithAvailableStock,
  getProductWithRelations,
  getTypeList,
} from "../../services/productService";
import cacheQueue from "../../jobs/queues/cacheQueue";
import {
  addProductToFavourite,
  removeProductFromFavourite,
} from "../../services/userService";
import { pStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../services/prismaClient";

interface CustomRequest extends Request {
  userId?: number;
}

export const getProduct = [
  param("id", "Product ID is required.").isInt({ gt: 0 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const productId = req.params.id;
    const userId = req.userId;

    try {
      const product = await prisma.product.findUnique({
        where: { id: +productId },
        include: {
          images: {
            select: {
              id: true,
              path: true,
            },
          },
        },
      });

      if (!product) {
        return next(createError("Product not found", 404, errorCode.notFound));
      }

      // Get user's reserved quantity
      let userReserved = 0;
      if (userId) {
        const userCartItems = await prisma.cartItem.findMany({
          where: {
            productId: +productId,
            session: {
              userId: userId,
              status: "ACTIVE",
              expiresAt: { gt: new Date() },
            },
          },
          select: {
            quantity: true,
          },
        });

        userReserved = userCartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }

      const available = Math.max(0, product.inventory - product.reserved);

      const response = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        rating: product.rating,
        status: product.status,
        pstatus: product.pstatus,
        images: product.images,
        inventory: product.inventory,
        reserved: product.reserved,
        available,
        userReserved,
        canBuy: product.status === "ACTIVE" && available > 0,
      };

      res.status(200).json({
        message: "Product Detail",
        product: response,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      return next(
        createError("Failed to fetch product", 500, errorCode.server)
      );
    }
  },
];
export const getProductsByPagination = [
  query("cursor", "Cursor must be Post ID.").isInt({ gt: 0 }).optional(),
  query("limit", "Limit number must be unsigned integer.")
    .isInt({ gt: 3 })
    .optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit || 5;
    const category = req.query.category;
    const type = req.query.type;
    const pstatus = req.query.pstatus;

    const userId = req.userId;
    const user = await getUserbyId(userId!);
    checkUserIfNotExist(user);

    let categoryList: number[] = [];
    let typeList: number[] = [];

    if (category) {
      categoryList = category
        .toString()
        .split(",")
        .map((c) => Number(c))
        .filter((c) => c > 0);
    }

    if (type) {
      typeList = type
        .toString()
        .split(",")
        .map((t) => Number(t))
        .filter((t) => t > 0);
    }

    console.log("categoryList -----", categoryList);

    const where = {
      AND: [
        { pstatus: "ORDER" },
        categoryList.length > 0 ? { categoryId: { in: categoryList } } : {},
        typeList.length > 0 ? { typeId: { in: typeList } } : {},
      ],
    };

    const options = {
      where,
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        status: true,
        pstatus: true,
        images: {
          select: {
            id: true,
            path: true,
          },
          take: 1,
        },
      },
      orderBy: {
        id: "desc",
      },
    };

    const cacheKey = `products:ORDER${pstatus || "all"}:${JSON.stringify(
      req.query
    )}`;
    const products = await getOrSetCache(cacheKey, async () => {
      return await getProductsList(options);
    });

    const hasNextPage = products.length > +limit;

    if (hasNextPage) {
      products.pop();
    }

    const nextCursor =
      products.length > 0 ? products[products.length - 1].id : null;

    res.status(200).json({
      message: "Get All infinite products",
      hasNextPage,
      nextCursor,
      prevCursor: lastCursor,
      products,
    });
  },
];

export const getPreorderProductsByPagination = [
  query("cursor", "Cursor must be Post ID.").isInt({ gt: 0 }).optional(),
  query("limit", "Limit number must be unsigned integer.")
    .isInt({ gt: 3 })
    .optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit || 5;
    const category = req.query.category;
    const type = req.query.type;
    const pstatus = req.query.pstatus;

    const userId = req.userId;
    const user = await getUserbyId(userId!);
    checkUserIfNotExist(user);

    let categoryList: number[] = [];
    let typeList: number[] = [];

    if (category) {
      categoryList = category
        .toString()
        .split(",")
        .map((c) => Number(c))
        .filter((c) => c > 0);
    }

    if (type) {
      typeList = type
        .toString()
        .split(",")
        .map((t) => Number(t))
        .filter((t) => t > 0);
    }

    console.log("categoryList -----", categoryList);

    const where = {
      AND: [
        { pstatus: "PREORDER" },
        categoryList.length > 0 ? { categoryId: { in: categoryList } } : {},
        typeList.length > 0 ? { typeId: { in: typeList } } : {},
      ],
    };

    const options = {
      where,
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        status: true,
        pstatus: true,
        images: {
          select: {
            id: true,
            path: true,
          },
          take: 1,
        },
      },
      orderBy: {
        id: "desc",
      },
    };

    const cacheKey = `products:PREORDER${pstatus || "all"}:${JSON.stringify(
      req.query
    )}`;
    const products = await getOrSetCache(cacheKey, async () => {
      return await getProductsList(options);
    });

    const hasNextPage = products.length > +limit;

    if (hasNextPage) {
      products.pop();
    }

    const nextCursor =
      products.length > 0 ? products[products.length - 1].id : null;

    res.status(200).json({
      message: "Get All infinite products",
      hasNextPage,
      nextCursor,
      prevCursor: lastCursor,
      products,
    });
  },
];

export const getCategoryType = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserbyId(userId!);
  checkUserIfNotExist(user);

  const categories = await getCategoryList();
  const types = await getTypeList();

  res.status(200).json({
    message: "Category & Types",
    categories,
    types,
  });
};

export const toggleFavourite = [
  body("productId", "Product ID must not be empty.").isInt({ gt: 0 }),
  body("favourite", "Favourite must not be empty.").isBoolean(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const userId = req.userId;
    const user = await getUserbyId(userId!);
    checkUserIfNotExist(user);

    const { productId, favourite } = req.body;

    if (favourite) {
      await addProductToFavourite(user!.id, productId);
    } else {
      await removeProductFromFavourite(user!.id, productId);
    }

    await cacheQueue.add(
      "invalidate-product-cache",
      {
        pattern: "products:*",
      },
      {
        jobId: `invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(200).json({
      message: favourite
        ? "Successfully added favourite"
        : "Successfully removed favourite",
    });
  },
];

export const checkStockAvailability = [
  param("id", "Product ID is required.").isInt({ gt: 0 }),
  query("quantity", "Quantity is required.").isInt({ gt: 0 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const productId = parseInt(req.params.id);
    const quantity = parseInt(req.query.quantity as string);

    try {
      const product = await getProductWithAvailableStock(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const available = product.inventory - product.reserved;
      const isAvailable = available >= quantity;

      res.status(200).json({
        isAvailable,
        available,
        requested: quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
      });
    } catch (error) {
      console.error("Error checking stock:", error);
      res.status(500).json({ error: "Failed to check stock availability" });
    }
  },
];

export const getProductStock = [
  param("id", "Product ID is required.").isInt({ gt: 0 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const productId = parseInt(req.params.id);
    const userId = req.userId;

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          inventory: true,
          reserved: true,
          status: true,
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Get user's reserved quantity
      let userReserved = 0;
      if (userId) {
        const userCartItems = await prisma.cartItem.findMany({
          where: {
            productId: productId,
            session: {
              userId: userId,
              status: "ACTIVE",
              expiresAt: { gt: new Date() },
            },
          },
          select: {
            quantity: true,
          },
        });

        userReserved = userCartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }

      const available = product.inventory - product.reserved;
      const availableForUser = Math.max(0, available - userReserved);

      res.status(200).json({
        id: product.id,
        inventory: product.inventory,
        reserved: product.reserved,
        available: available,
        availableForUser: availableForUser,
        userReserved: userReserved,
        status: product.status,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ error: "Failed to fetch stock" });
    }
  },
];
