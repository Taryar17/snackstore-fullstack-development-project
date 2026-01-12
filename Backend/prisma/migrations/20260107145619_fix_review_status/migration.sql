/*
  Warnings:

  - You are about to drop the column `orderId` on the `Review` table. All the data in the column will be lost.
  - Made the column `comment` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('ACTIVE', 'HIDDEN');

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "orderId",
ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "comment" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
