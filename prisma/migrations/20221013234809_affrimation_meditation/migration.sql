/*
  Warnings:

  - You are about to drop the column `userId` on the `Meditation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Affrimations` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_AffrimationsToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AffrimationsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Affrimations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AffrimationsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MeditationToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MeditationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Meditation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MeditationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meditation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Meditation" ("id", "title") SELECT "id", "title" FROM "Meditation";
DROP TABLE "Meditation";
ALTER TABLE "new_Meditation" RENAME TO "Meditation";
CREATE TABLE "new_Affrimations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Affrimations" ("id", "title") SELECT "id", "title" FROM "Affrimations";
DROP TABLE "Affrimations";
ALTER TABLE "new_Affrimations" RENAME TO "Affrimations";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_AffrimationsToUser_AB_unique" ON "_AffrimationsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AffrimationsToUser_B_index" ON "_AffrimationsToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MeditationToUser_AB_unique" ON "_MeditationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MeditationToUser_B_index" ON "_MeditationToUser"("B");
