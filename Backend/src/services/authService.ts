import { prisma } from "../lib/prisma";

export const getUserbyPhone = async (phone: string) => {
  return prisma.user.findUnique({ where: { phone } });
};

export const getUserbyId = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};
export const createOtp = async (otpData: any) => {
  return prisma.otp.create({ data: otpData });
};

export const getOtpbyPhone = async (phone: string) => {
  return prisma.otp.findUnique({
    where: { phone },
  });
};

export const updateOtp = async (id: number, otpData: any) => {
  return prisma.otp.update({
    where: { id },
    data: otpData,
  });
};

export const createUser = async (userData: any) => {
  return prisma.user.create({
    data: {
      phone: userData.phone,
      password: userData.password,
      randToken: userData.randToken,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      address: userData.address,
      city: userData.city,
      region: userData.region,
    },
  });
};

export const updateUser = async (id: number, userData: any) => {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};
