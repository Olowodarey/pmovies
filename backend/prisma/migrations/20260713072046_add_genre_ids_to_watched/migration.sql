-- AlterTable
ALTER TABLE "WatchedEntry" ADD COLUMN     "genreIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
