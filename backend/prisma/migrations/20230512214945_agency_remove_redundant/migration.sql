/*
  Warnings:

  - You are about to drop the column `city` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Agency` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "city",
DROP COLUMN "country";
