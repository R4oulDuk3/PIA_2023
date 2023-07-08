/*
  Warnings:

  - Added the required column `newMaxWorkerCount` to the `WorkerMaxCountIncreaseRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkerMaxCountIncreaseRequest" ADD COLUMN     "newMaxWorkerCount" INTEGER NOT NULL;
