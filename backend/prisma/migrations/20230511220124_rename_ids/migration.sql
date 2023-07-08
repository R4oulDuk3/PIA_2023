/*
  Warnings:

  - You are about to drop the column `userId` on the `PasswordResetToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idUser]` on the table `PasswordResetToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUser` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_userId_fkey";

-- DropIndex
DROP INDEX "PasswordResetToken_userId_key";

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "userId",
ADD COLUMN     "idUser" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_idUser_key" ON "PasswordResetToken"("idUser");

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
