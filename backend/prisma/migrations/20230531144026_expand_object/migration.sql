/*
  Warnings:

  - Added the required column `idClient` to the `Object` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Object` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doorX` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doorY` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ObjectType" AS ENUM ('house', 'flat');

-- AlterTable
ALTER TABLE "Object" ADD COLUMN     "idClient" INTEGER NOT NULL,
ADD COLUMN     "type" "ObjectType" NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "doorX" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "doorY" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
