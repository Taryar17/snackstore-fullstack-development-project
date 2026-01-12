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
