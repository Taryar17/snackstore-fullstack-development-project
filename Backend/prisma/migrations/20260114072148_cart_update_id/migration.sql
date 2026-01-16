/*
  Warnings:

  - The primary key for the `CartSession` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_sessionId_fkey";

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "sessionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "CartSession" DROP CONSTRAINT "CartSession_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CartSession_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CartSession_id_seq";

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CartSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
