-- DropForeignKey
ALTER TABLE "PickGamePlayerChampion" DROP CONSTRAINT "PickGamePlayerChampion_gameId_fkey";

-- AddForeignKey
ALTER TABLE "PickGamePlayerChampion" ADD CONSTRAINT "PickGamePlayerChampion_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "PickGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
