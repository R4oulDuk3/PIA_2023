-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_idLocation_fkey";

-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Chart" DROP CONSTRAINT "Chart_idObject_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_idAgency_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_idClient_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_idAgency_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_idClient_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_idObject_fkey";

-- DropForeignKey
ALTER TABLE "JobAssigment" DROP CONSTRAINT "JobAssigment_idJob_fkey";

-- DropForeignKey
ALTER TABLE "JobAssigment" DROP CONSTRAINT "JobAssigment_idWorker_fkey";

-- DropForeignKey
ALTER TABLE "JobCancelation" DROP CONSTRAINT "JobCancelation_idJob_fkey";

-- DropForeignKey
ALTER TABLE "JobRequest" DROP CONSTRAINT "JobRequest_idAgency_fkey";

-- DropForeignKey
ALTER TABLE "JobRequest" DROP CONSTRAINT "JobRequest_idClient_fkey";

-- DropForeignKey
ALTER TABLE "JobRequest" DROP CONSTRAINT "JobRequest_idObject_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_idClient_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_idUser_fkey";

-- DropForeignKey
ALTER TABLE "RegistrationRequest" DROP CONSTRAINT "RegistrationRequest_idUser_fkey";

-- DropForeignKey
ALTER TABLE "RoomProgress" DROP CONSTRAINT "RoomProgress_idJob_fkey";

-- DropForeignKey
ALTER TABLE "RoomProgress" DROP CONSTRAINT "RoomProgress_idRoom_fkey";

-- DropForeignKey
ALTER TABLE "Worker" DROP CONSTRAINT "Worker_idAgency_fkey";

-- DropForeignKey
ALTER TABLE "WorkerMaxCountIncreaseRequest" DROP CONSTRAINT "WorkerMaxCountIncreaseRequest_idAgency_fkey";

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_idLocation_fkey" FOREIGN KEY ("idLocation") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationRequest" ADD CONSTRAINT "RegistrationRequest_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_idObject_fkey" FOREIGN KEY ("idObject") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomProgress" ADD CONSTRAINT "RoomProgress_idRoom_fkey" FOREIGN KEY ("idRoom") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomProgress" ADD CONSTRAINT "RoomProgress_idJob_fkey" FOREIGN KEY ("idJob") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_idObject_fkey" FOREIGN KEY ("idObject") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_idObject_fkey" FOREIGN KEY ("idObject") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAssigment" ADD CONSTRAINT "JobAssigment_idJob_fkey" FOREIGN KEY ("idJob") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAssigment" ADD CONSTRAINT "JobAssigment_idWorker_fkey" FOREIGN KEY ("idWorker") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCancelation" ADD CONSTRAINT "JobCancelation_idJob_fkey" FOREIGN KEY ("idJob") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerMaxCountIncreaseRequest" ADD CONSTRAINT "WorkerMaxCountIncreaseRequest_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
