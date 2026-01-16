/*
  Warnings:

  - The primary key for the `CartSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CartSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `sessionId` on the `CartItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_sessionId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "sessionId",
ADD COLUMN     "sessionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CartSession" DROP CONSTRAINT "CartSession_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CartSession_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_sessionId_productId_key" ON "CartItem"("sessionId", "productId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CartSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
