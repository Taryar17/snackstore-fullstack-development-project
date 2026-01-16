// controllers/adminDashboardController.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../services/prismaClient";
import { createError } from "../../utils/error";
import { errorCode } from "../../config/errorCode";
import { body, validationResult } from "express-validator";
import { findOneOrder } from "../../services/dashboardService";

interface CustomRequest extends Request {
  userId?: number;
}

export const getDashboardStats = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalTypes,
      totalOrders,
      totalUsers,
      recentOrders,
      ordersNeedingDeliveryDate,
      upcomingDeliveries,
      todaysDeliveries,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.type.count(),
      prisma.order.count(),

      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          products: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({
        where: {
          OR: [
            { estDeliveryDate: null },
            { estDeliveryDate: { equals: null } },
          ],
        },
      }),
      prisma.order.count({
        where: {
          estDeliveryDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.order.count({
        where: {
          estDeliveryDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

    const orderStatusStats = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const revenueResult = await prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    });
    const totalRevenue = revenueResult._sum.totalPrice || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    const productStatusStats = await prisma.product.groupBy({
      by: ["pstatus"],
      _count: {
        id: true,
      },
    });

    res.status(200).json({
      message: "Dashboard stats retrieved successfully",
      stats: {
        totalProducts,
        totalCategories,
        totalTypes,
        totalOrders,
        totalUsers,
        totalRevenue: Number(totalRevenue),
        todayOrders,
        ordersNeedingDeliveryDate,
        upcomingDeliveries,
        todaysDeliveries,
        orderStatusStats,
        productStatusStats,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        code: order.code,
        customerName: order.user.firstName
          ? `${order.user.firstName} ${order.user.lastName || ""}`.trim()
          : order.user.phone,
        status: order.status,
        total: Number(order.totalPrice),
        createdAt: order.createdAt,
        itemsCount: order.products.length,
        estimatedDeliveryDate: order.estDeliveryDate,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return next(
      createError("Failed to get dashboard stats", 500, errorCode.server)
    );
  }
};

export const getDetailedStats = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { period = "month" } = req.query;

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get orders in period
    const ordersInPeriod = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const newUsersInPeriod = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        role: "USER",
      },
    });

    res.status(200).json({
      message: "Detailed stats retrieved",
      period,
      ordersInPeriod: ordersInPeriod.length,
      revenueInPeriod: ordersInPeriod.reduce(
        (sum, order) => sum + Number(order.totalPrice),
        0
      ),
      newUsersInPeriod,
    });
  } catch (error) {
    console.error("Detailed stats error:", error);
    return next(
      createError("Failed to get detailed stats", 500, errorCode.server)
    );
  }
};

export const getOrderDetail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const orderId = parseInt(req.params.orderId);

  if (isNaN(orderId)) {
    return next(createError("Invalid order ID", 400, errorCode.invalid));
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
        ...order,
        totalPrice: Number(order.totalPrice),
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

// Update order status
export const updateOrderStatus = [
  body("status")
    .isIn(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"])
    .withMessage("Invalid status"),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(errors.array()[0].msg, 400, errorCode.invalid));
    }

    const orderId = parseInt(req.params.orderId);
    const { status } = req.body;

    if (isNaN(orderId)) {
      return next(createError("Invalid order ID", 400, errorCode.invalid));
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return next(createError("Order not found", 404, errorCode.notFound));
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });

      res.status(200).json({
        message: "Order status updated",
        order: updatedOrder,
        previousStatus: order.status,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      return next(
        createError("Failed to update order status", 500, errorCode.server)
      );
    }
  },
];

export const setDeliveryDate = [
  body("estimatedDeliveryDate")
    .notEmpty()
    .withMessage("Delivery date is required"),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(errors.array()[0].msg, 400, errorCode.invalid));
    }

    const orderId = parseInt(req.params.orderId);
    const { estimatedDeliveryDate } = req.body;

    if (isNaN(orderId)) {
      return next(createError("Invalid order ID", 400, errorCode.invalid));
    }

    try {
      // Verify order exists
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return next(createError("Order not found", 404, errorCode.notFound));
      }

      // Parse and validate date
      const deliveryDate = new Date(estimatedDeliveryDate);
      if (isNaN(deliveryDate.getTime())) {
        return next(createError("Invalid date format", 400, errorCode.invalid));
      }

      // Ensure date is in the future
      if (deliveryDate < new Date()) {
        return next(
          createError(
            "Delivery date must be in the future",
            400,
            errorCode.invalid
          )
        );
      }

      // Update order with delivery date
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          estDeliveryDate: deliveryDate,
          status: "PROCESSING",
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json({
        message: "Delivery date set successfully",
        order: {
          id: updatedOrder.id,
          code: updatedOrder.code,
          estimatedDeliveryDate: updatedOrder.estDeliveryDate,
          status: updatedOrder.status,
          customerName: `${updatedOrder.user.firstName || ""} ${
            updatedOrder.user.lastName || ""
          }`.trim(),
          customerPhone: updatedOrder.user.phone,
        },
      });
    } catch (error) {
      console.error("Set delivery date error:", error);
      return next(
        createError("Failed to set delivery date", 500, errorCode.server)
      );
    }
  },
];

export const getOrdersNeedingDeliveryDate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        estDeliveryDate: null,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      code: order.code,
      customerName: order.user.firstName
        ? `${order.user.firstName} ${order.user.lastName || ""}`.trim()
        : order.user.phone,
      phone: order.user.phone,
      total: Number(order.totalPrice),
      createdAt: order.createdAt,
      itemsCount: order.products.length,
      itemNames: order.products
        .map((item) => item.product.name)
        .slice(0, 2)
        .join(", "),
    }));

    res.status(200).json({
      message: "Orders needing delivery date",
      orders: formattedOrders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Get orders needing delivery date error:", error);
    return next(createError("Failed to get orders", 500, errorCode.server));
  }
};
