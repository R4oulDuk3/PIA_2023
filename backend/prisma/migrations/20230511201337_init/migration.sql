-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('client', 'agency', 'admin');

-- CreateEnum
CREATE TYPE "RoomState" AS ENUM ('notStarted', 'inProgress', 'finished');

-- CreateEnum
CREATE TYPE "JobState" AS ENUM ('inProgress', 'finished', 'canceled');

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'default.png',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "type" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "idUser" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "idLocation" INTEGER NOT NULL,
    "uniqueCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currentWorkerCount" INTEGER NOT NULL,
    "maxWorkerCount" INTEGER NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationRequest" (
    "id" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL,

    CONSTRAINT "RegistrationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Object" (
    "id" SERIAL NOT NULL,
    "addressId" INTEGER NOT NULL,
    "roomCount" INTEGER NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Object_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" SERIAL NOT NULL,
    "idObject" INTEGER NOT NULL,

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "cordX" DOUBLE PRECISION NOT NULL,
    "cordY" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "chartId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomProgress" (
    "id" SERIAL NOT NULL,
    "idRoom" INTEGER NOT NULL,
    "idJob" INTEGER NOT NULL,
    "roomState" "RoomState" NOT NULL,

    CONSTRAINT "RoomProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRequest" (
    "id" SERIAL NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idObject" INTEGER NOT NULL,
    "idAgency" INTEGER NOT NULL,
    "idClient" INTEGER NOT NULL,

    CONSTRAINT "JobRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "state" "JobState" NOT NULL DEFAULT 'inProgress',
    "idObject" INTEGER NOT NULL,
    "idAgency" INTEGER NOT NULL,
    "idClient" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCancelation" (
    "id" SERIAL NOT NULL,
    "idJob" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobCancelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerMaxCountIncreaseRequest" (
    "id" SERIAL NOT NULL,
    "idAgency" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "WorkerMaxCountIncreaseRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "idAgency" INTEGER NOT NULL,
    "roomProgressId" INTEGER NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_idUser_key" ON "Client"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_idUser_key" ON "Agency"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_idUser_key" ON "Admin"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationRequest_idUser_key" ON "RegistrationRequest"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_userId_key" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Chart_idObject_key" ON "Chart"("idObject");

-- CreateIndex
CREATE UNIQUE INDEX "RoomProgress_idRoom_key" ON "RoomProgress"("idRoom");

-- CreateIndex
CREATE UNIQUE INDEX "JobCancelation_idJob_key" ON "JobCancelation"("idJob");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerMaxCountIncreaseRequest_idAgency_key" ON "WorkerMaxCountIncreaseRequest"("idAgency");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_email_key" ON "Worker"("email");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_idLocation_fkey" FOREIGN KEY ("idLocation") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationRequest" ADD CONSTRAINT "RegistrationRequest_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_idObject_fkey" FOREIGN KEY ("idObject") REFERENCES "Object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomProgress" ADD CONSTRAINT "RoomProgress_idRoom_fkey" FOREIGN KEY ("idRoom") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomProgress" ADD CONSTRAINT "RoomProgress_idJob_fkey" FOREIGN KEY ("idJob") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_idObject_fkey" FOREIGN KEY ("idObject") REFERENCES "Object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_idObject_fkey" FOREIGN KEY ("idObject") REFERENCES "Object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCancelation" ADD CONSTRAINT "JobCancelation_idJob_fkey" FOREIGN KEY ("idJob") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerMaxCountIncreaseRequest" ADD CONSTRAINT "WorkerMaxCountIncreaseRequest_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_roomProgressId_fkey" FOREIGN KEY ("roomProgressId") REFERENCES "RoomProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
