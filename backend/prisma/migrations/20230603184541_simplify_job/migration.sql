/*
  Warnings:

  - You are about to drop the `RoomProgressWorker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomProgressWorker" DROP CONSTRAINT "RoomProgressWorker_roomProgressId_fkey";

-- DropForeignKey
ALTER TABLE "RoomProgressWorker" DROP CONSTRAINT "RoomProgressWorker_workerId_fkey";

-- DropTable
DROP TABLE "RoomProgressWorker";

-- CreateTable
CREATE TABLE "JobAssigment" (
    "id" SERIAL NOT NULL,
    "idJob" INTEGER NOT NULL,
    "idWorker" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobAssigment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobAssigment_idJob_key" ON "JobAssigment"("idJob");

-- AddForeignKey
ALTER TABLE "JobAssigment" ADD CONSTRAINT "JobAssigment_idJob_fkey" FOREIGN KEY ("idJob") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAssigment" ADD CONSTRAINT "JobAssigment_idWorker_fkey" FOREIGN KEY ("idWorker") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
