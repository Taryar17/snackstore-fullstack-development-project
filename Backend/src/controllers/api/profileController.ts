import { Request, Response, NextFunction } from "express";
import { unlink } from "node:fs/promises";
import path from "path";
import { getUserbyId, updateUser } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { checkUploadFile } from "../../utils/check";
import imageQueue from "../../jobs/queues/imageQueue";
import { createError } from "../../utils/error";
import { errorCode } from "../../config/errorCode";
import { prisma } from "../../services/prismaClient";
import { body, validationResult } from "express-validator";
import { authData } from "../authControllers";

interface CustomRequest extends Request {
  userId?: number;
}

export const uploadProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserbyId(userId!);
  checkUserIfNotExist(user);
  checkUploadFile(image);

  const fileName = image!.filename;

  if (user?.image) {
    try {
      const filePath = path.join(
        __dirname,
        "../../../",
        "uploads/images",
        user!.image!
      );
      await unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }

  const userData = {
    image: fileName,
  };

  await updateUser(userId!, userData);
  res.status(200).json({
    message: "Profile picture uploaded successfully",
  });
};

//testing
export const getMyPhoto = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const file = path.join(
    __dirname,
    "../../../",
    "uploads/images",
    "1755280127672=415852824-coding_crocodile.jpg"
  );

  res.sendFile(file, (err) => res.status(404).send("File not found"));
};

export const uploadProfileMultiple = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("req.files-----", req.files);
  res.status(200).json({
    message: "Multiple files uploaded successfully",
  });
};

export const uploadProfileOptimize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserbyId(userId!);
  checkUserIfNotExist(user);
  checkUploadFile(image);

  const splitFileName = req.file?.filename.split(".")[0];

  const job = await imageQueue.add(
    "optimize-image",
    {
      filePath: req.file?.path,
      fileName: `${splitFileName}.webp`,
      width: 200,
      height: 200,
      quality: 50,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );

  if (user?.image) {
    try {
      const originalFilePath = path.join(
        __dirname,
        "../../../",
        "uploads/images",
        user!.image!
      );

      const optimizedFilePath = path.join(
        __dirname,
        "../../../",
        "uploads/optimized",
        user!.image!.split(".")[0] + ".webp"
      );
      await unlink(originalFilePath);
      await unlink(optimizedFilePath);
    } catch (error) {
      console.log(error);
    }
  }
  const userData = {
    image: req.file?.originalname,
  };
  await updateUser(user?.id!, userData);

  res.status(200).json({
    message: "Profile picture optimized and uploaded successfully",
    image: splitFileName + ".webp",
    jobId: job.id,
  });
};

interface CustomRequest extends Request {
  userId?: number;
}

// Update user profile
export const updateProfileValidation = [
  body("firstName").optional().trim().escape(),
  body("lastName").optional().trim().escape(),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("address").optional().trim().escape(),
  body("city").optional().trim().escape(),
  body("region").optional().trim().escape(),
];

export const updateUserProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(errors.array()[0].msg, 400, errorCode.invalid));
  }

  const userId = req.userId;
  if (!userId) {
    return next(
      createError("User not authenticated", 401, errorCode.unauthenticated)
    );
  }

  const { firstName, lastName, email, address, city, region } = req.body;

  try {
    const user = await getUserbyId(userId!);
    checkUserIfNotExist(user);

    const updatedUser = await updateUser(userId!, {
      firstName,
      lastName,
      email,
      address,
      city,
      region,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return next(createError("Failed to update profile", 500, errorCode.server));
  }
};

export const getUserOrders = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  if (!userId) {
    return next(
      createError("User not authenticated", 401, errorCode.unauthenticated)
    );
  }

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          products: {
            include: {
              product: {
                select: {
                  name: true,
                  images: { take: 1, select: { path: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      code: order.code,
      status: order.status,
      totalPrice: Number(order.totalPrice),
      createdAt: order.createdAt,
      estimatedDeliveryDate: order.estDeliveryDate,
      itemsCount: order.products.reduce((sum, item) => sum + item.quantity, 0),
      items: order.products.map((item) => ({
        name: item.product.name,
        image: item.product.images[0]?.path,
        quantity: item.quantity,
      })),
    }));

    res.status(200).json({
      message: "User orders retrieved",
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    return next(
      createError("Failed to get user orders", 500, errorCode.server)
    );
  }
};

export const getOrderDetail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const orderId = parseInt(req.params.orderId);
  const userId = req.userId;

  if (isNaN(orderId)) {
    return next(createError("Invalid order ID", 400, errorCode.invalid));
  }
  if (!userId) {
    return next(
      createError("User not authenticated", 401, errorCode.unauthenticated)
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            address: true,
            city: true,
            region: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                pstatus: true,
                images: {
                  select: {
                    path: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return next(createError("Order not found", 404, errorCode.notFound));
    }

    // Calculate totals
    const subtotal = Number(order.totalPrice) / 1.1;
    const tax = Number(order.totalPrice) * 0.1;
    const itemsCount = order.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    res.status(200).json({
      message: "Order details retrieved",
      order: {
        id: order.id,
        code: order.code,
        status: order.status,
        totalPrice: Number(order.totalPrice),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        estimatedDeliveryDate: order.estDeliveryDate,
        products: order.products.map((item) => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
          },
          quantity: item.quantity,
          price: item.price,
        })),
        user: order.user,
      },
      summary: {
        subtotal,
        tax,
        itemsCount,
        total: Number(order.totalPrice),
      },
    });
  } catch (error) {
    console.error("Get order detail error:", error);
    return next(
      createError("Failed to retrieve order details", 500, errorCode.server)
    );
  }
};
