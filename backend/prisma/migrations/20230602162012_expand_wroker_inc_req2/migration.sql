/*
  Warnings:

  - You are about to drop the column `roomProgressId` on the `Worker` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Worker" DROP CONSTRAINT "Worker_roomProgressId_fkey";

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "roomProgressId";

-- CreateTable
CREATE TABLE "RoomProgressWorker" (
    "workerId" INTEGER NOT NULL,
    "roomProgressId" INTEGER NOT NULL,

    CONSTRAINT "RoomProgressWorker_pkey" PRIMARY KEY ("workerId","roomProgressId")
);

-- AddForeignKey
ALTER TABLE "RoomProgressWorker" ADD CONSTRAINT "RoomProgressWorker_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomProgressWorker" ADD CONSTRAINT "RoomProgressWorker_roomProgressId_fkey" FOREIGN KEY ("roomProgressId") REFERENCES "RoomProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
