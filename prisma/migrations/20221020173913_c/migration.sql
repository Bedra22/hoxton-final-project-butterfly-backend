/*
  Warnings:

  - You are about to drop the column `caption` on the `VisionBoard` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VisionBoard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "VisionBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_VisionBoard" ("id", "photoUrl", "title", "userId") SELECT "id", "photoUrl", "title", "userId" FROM "VisionBoard";
DROP TABLE "VisionBoard";
ALTER TABLE "new_VisionBoard" RENAME TO "VisionBoard";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
