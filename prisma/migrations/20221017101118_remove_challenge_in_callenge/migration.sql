/*
  Warnings:

  - You are about to drop the column `challenge` on the `DailyChallenges` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyChallenges" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_DailyChallenges" ("id", "image", "title") SELECT "id", "image", "title" FROM "DailyChallenges";
DROP TABLE "DailyChallenges";
ALTER TABLE "new_DailyChallenges" RENAME TO "DailyChallenges";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
