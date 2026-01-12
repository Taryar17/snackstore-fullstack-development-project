import { prisma } from "./prismaClient";

export const getOrderDetailService = async (id: number) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
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
};

export const findOneOrder = async (id: number) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });
};

export const getDashboardStats = async () => {
  // Run all queries in parallel for better performance
  const [
    totalProducts,
    totalCategories,
    totalTypes,
    totalOrders,
    totalUsers,
    activeProducts,
    orderProducts,
    preorderProducts,
    recentOrders,
  ] = await Promise.all([
    // Total Products
    prisma.product.count(),

    // Total Categories
    prisma.category.count(),

    // Total Types
    prisma.type.count(),

    // Total Orders
    prisma.order.count(),

    // Total Users
    prisma.user.count(),

    // Active Products
    prisma.product.count({
      where: {
        status: "ACTIVE",
      },
    }),

    // Order Products (pstatus = "ORDER")
    prisma.product.count({
      where: {
        pstatus: "ORDER",
      },
    }),

    // Preorder Products (pstatus = "PREORDER")
    prisma.product.count({
      where: {
        pstatus: "PREORDER",
      },
    }),

    // Recent Orders (last 5)
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            phone: true,
          },
        },
      },
    }),
  ]);

  // Calculate inactive products
  const inactiveProducts = totalProducts - activeProducts;

  return {
    totalProducts,
    totalCategories,
    totalTypes,
    totalOrders,
    totalUsers,
    activeProducts,
    inactiveProducts,
    orderProducts,
    preorderProducts,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      code: order.code,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      userPhone: order.user.phone,
    })),
  };
};

export const updateOrderStatusService = async (id: number, status: string) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};
