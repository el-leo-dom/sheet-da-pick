-- CreateEnum
CREATE TYPE "Lane" AS ENUM ('TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT', 'NONE');

-- AlterTable
ALTER TABLE "PickGamePlayerChampion" ADD COLUMN     "lane" "Lane" NOT NULL DEFAULT 'NONE';
