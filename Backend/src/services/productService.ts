import { stockWSS } from "..";
import { prisma } from "./prismaClient";

export const createOneProduct = async (data: any) => {
  const productdata: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    inventory: data.inventory,
    status: data.status,
    pstatus: data.pstatus,
    category: {
      connectOrCreate: {
        where: { name: data.category },
        create: {
          name: data.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: data.type },
        create: {
          name: data.type,
        },
      },
    },
    images: {
      create: data.images,
    },
  };

  if (data.tags && data.tags.length > 0) {
    productdata.tags = {
      connectOrCreate: data.tags.map((tagName: string) => ({
        where: { name: tagName },
        create: {
          name: tagName,
        },
      })),
    };
  }
  return prisma.product.create({ data: productdata });
};
export const getAllAdminProducts = async () => {
  return prisma.product.findMany({
    include: {
      images: true,
      category: true,
      type: true,
      tags: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
};

export const updateOneProduct = async (productId: number, data: any) => {
  const productdata: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    inventory: data.inventory,
    status: data.status || "ACTIVE",
    pstatus: data.pstatus || "ORDER",
    category: {
      connectOrCreate: {
        where: { name: data.category },
        create: {
          name: data.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: data.type },
        create: {
          name: data.type,
        },
      },
    },
  };

  if (data.tags && data.tags.length > 0) {
    productdata.tags = {
      set: [],
      connectOrCreate: data.tags.map((tagName: string) => ({
        where: { name: tagName },
        create: {
          name: tagName,
        },
      })),
    };
  }

  if (data.images && data.images.length > 0) {
    productdata.images = {
      deleteMany: {},
      create: data.images,
    };
  }
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: productdata,
  });

  if (stockWSS) {
    await stockWSS.broadcastStockUpdate(productId);
  }

  return updatedProduct;
};

export const deleteOneProduct = async (id: number) => {
  if (stockWSS) {
    await stockWSS.broadcastStockUpdate(id);
  }
  return prisma.product.delete({
    where: { id },
  });
};

export const getProductWithRelations = async (id: number, userId: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        select: {
          id: true,
          path: true,
        },
      },
      users: {
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  // Get user's reserved quantity from cart
  const userCartItems = await prisma.cartItem.findMany({
    where: {
      productId: id,
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

  const userReserved = userCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const available = Math.max(0, product.inventory - product.reserved);

  return {
    ...product,
    available,
    userReserved,
  };
};

export const getProductsList = async (options: any) => {
  const products = await prisma.product.findMany({
    ...options,
    select: {
      ...options.select,
      reserved: true,
    },
  });

  return products.map((product) => ({
    ...product,
    available: product.inventory - product.reserved,
  }));
};

export const getCategoryList = async () => {
  return prisma.category.findMany();
};

export const getTypeList = async () => {
  return prisma.type.findMany();
};

export const getProductWithAvailableStock = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      price: true,
      inventory: true,
      reserved: true,
      status: true,
    },
  });

  if (product) {
    return {
      ...product,
      available: product.inventory - product.reserved,
    };
  }

  return null;
};
