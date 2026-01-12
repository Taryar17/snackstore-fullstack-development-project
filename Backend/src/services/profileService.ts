import { prisma } from "./prismaClient";

export const updateUserData = async (userId: number, data: any) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      region: data.region,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      image: true,
      role: true,
      address: true,
      city: true,
      region: true,
    },
  });
};
