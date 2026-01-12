import { prisma } from "./prismaClient";

export const getAdminUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      image: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAdminUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      address: true,
      city: true,
      region: true,
      phone: true,
      role: true,
      image: true,
      status: true,
    },
  });
};

export const updateAdminUser = async ({
  id,
  role,
  status,
}: {
  id: number;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "FREEZE";
}) => {
  return prisma.user.update({
    where: { id },
    data: { role, status },
  });
};
