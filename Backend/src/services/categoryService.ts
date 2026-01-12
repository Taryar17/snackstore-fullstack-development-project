import { prisma } from "./prismaClient";

export const createOneCategory = async (data: any) => {
  return prisma.category.create({
    data: {
      name: data.name,
    },
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({});
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const updateOneCategory = async (
  id: number,
  data: { name?: string }
) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteOneCategory = async (id: number) => {
  return prisma.category.delete({
    where: { id },
  });
};
