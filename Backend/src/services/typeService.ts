import { prisma } from "./prismaClient";

export const createType = async (data: any) => {
  return prisma.type.create({
    data: {
      name: data.name,
    },
  });
};

export const getTypeById = async (id: number) => {
  return prisma.type.findUnique({
    where: { id },
  });
};

export const getTypeList = async () => {
  return prisma.type.findMany({});
};

export const updateType = async (id: number, data: { name?: string }) => {
  return prisma.type.update({
    where: { id },
    data,
  });
};

export const deleteType = async (id: number) => {
  return prisma.type.delete({
    where: { id },
  });
};
