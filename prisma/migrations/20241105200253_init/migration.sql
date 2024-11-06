-- CreateEnum
CREATE TYPE "Team" AS ENUM ('TEAM_RED', 'TEAM_BLUE');

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lpPick" INTEGER NOT NULL DEFAULT 0,
    "profilePic" TEXT,
    "gamesPlayedPick" INTEGER NOT NULL DEFAULT 0,
    "winsPick" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickGame" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winningTeam" "Team" NOT NULL,

    CONSTRAINT "PickGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamRed" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TeamBlue" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeamRed_AB_unique" ON "_TeamRed"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamRed_B_index" ON "_TeamRed"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamBlue_AB_unique" ON "_TeamBlue"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamBlue_B_index" ON "_TeamBlue"("B");

-- AddForeignKey
ALTER TABLE "_TeamRed" ADD CONSTRAINT "_TeamRed_A_fkey" FOREIGN KEY ("A") REFERENCES "PickGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamRed" ADD CONSTRAINT "_TeamRed_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamBlue" ADD CONSTRAINT "_TeamBlue_A_fkey" FOREIGN KEY ("A") REFERENCES "PickGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamBlue" ADD CONSTRAINT "_TeamBlue_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
