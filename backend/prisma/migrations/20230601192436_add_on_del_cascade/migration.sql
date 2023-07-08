-- DropForeignKey
ALTER TABLE "Door" DROP CONSTRAINT "Door_chartId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_chartId_fkey";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Door" ADD CONSTRAINT "Door_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
