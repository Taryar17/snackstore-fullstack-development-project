/*
  Warnings:

  - You are about to drop the column `estDeliveryDate` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "estDeliveryDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "estDeliveryDate";
