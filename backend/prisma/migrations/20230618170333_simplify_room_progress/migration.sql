/*
  Warnings:

  - You are about to drop the column `roomProgressState` on the `RoomProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomProgress" DROP COLUMN "roomProgressState",
ADD COLUMN     "state" "RommProgressState" NOT NULL DEFAULT 'notStarted';
