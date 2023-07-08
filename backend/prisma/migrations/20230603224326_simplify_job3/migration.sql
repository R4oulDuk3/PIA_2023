/*
  Warnings:

  - You are about to drop the column `roomState` on the `RoomProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomProgress" DROP COLUMN "roomState",
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "RoomState";
