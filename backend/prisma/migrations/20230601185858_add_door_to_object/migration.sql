/*
  Warnings:

  - You are about to drop the column `doorX` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `doorY` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "doorX",
DROP COLUMN "doorY";

-- CreateTable
CREATE TABLE "Door" (
    "id" SERIAL NOT NULL,
    "cordX" DOUBLE PRECISION NOT NULL,
    "cordY" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "chartId" INTEGER NOT NULL,

    CONSTRAINT "Door_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Door" ADD CONSTRAINT "Door_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
