import { prisma } from "./prismaClient";
import { ReviewStatus } from "../../generated/prisma/enums";

export const createOneReview = async (data: {
  rating: number;
  comment: string;
  userId: number;
  productId: number;
}) => {
  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      userId: data.userId,
      productId: data.productId,
    },
  });
};

export const getReviewsByProductId = async (productId: number) => {
  return prisma.review.findMany({
    where: {
      productId,
      status: "ACTIVE",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllReviews = async () => {
  return prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          phone: true,
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateReviewStatus = async (
  reviewId: number,
  status: ReviewStatus
) => {
  return prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });
};

export const deleteOneReview = async (reviewId: number) => {
  return prisma.review.delete({
    where: { id: reviewId },
  });
};
