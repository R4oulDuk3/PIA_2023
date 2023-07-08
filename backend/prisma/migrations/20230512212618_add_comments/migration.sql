-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "idAgency" INTEGER NOT NULL,
    "idClient" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_idAgency_fkey" FOREIGN KEY ("idAgency") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
