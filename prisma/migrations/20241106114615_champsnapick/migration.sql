-- CreateTable
CREATE TABLE "PickGamePlayerChampion" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "champion" TEXT NOT NULL,

    CONSTRAINT "PickGamePlayerChampion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PickGamePlayerChampion" ADD CONSTRAINT "PickGamePlayerChampion_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "PickGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickGamePlayerChampion" ADD CONSTRAINT "PickGamePlayerChampion_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
