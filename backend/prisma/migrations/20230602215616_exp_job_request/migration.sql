/*
  Warnings:

  - The `status` column on the `JobRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JobRequestStatus" AS ENUM ('pending_no_offer', 'pending_with_offer', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "JobRequest" ADD COLUMN     "offer" DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" "JobRequestStatus" NOT NULL DEFAULT 'pending_no_offer';
