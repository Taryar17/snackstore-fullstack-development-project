import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
      image: {
        needs: { image: true },
        compute(user) {
          if (user.image) {
            return "/optimize/" + user.image.split(".")[0] + ".webp";
          }
          return user.image;
        },
      },
    },
    image: {
      path: {
        needs: { path: true },
        compute(image) {
          return "/optimized/" + image.path.split(".")[0] + ".webp";
        },
      },
    },
  },
});
