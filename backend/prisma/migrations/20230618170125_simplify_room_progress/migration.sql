/*
  Warnings:

  - You are about to drop the column `progress` on the `RoomProgress` table. All the data in the column will be lost.
  - You are about to drop the column `workStarted` on the `RoomProgress` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RommProgressState" AS ENUM ('notStarted', 'inConstruction', 'finished');

-- AlterTable
ALTER TABLE "RoomProgress" DROP COLUMN "progress",
DROP COLUMN "workStarted",
ADD COLUMN     "roomProgressState" "RommProgressState" NOT NULL DEFAULT 'notStarted';
