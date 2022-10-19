/*
  Warnings:

  - You are about to drop the column `image` on the `EachAffrimation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EachAffrimation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "affrimationsId" INTEGER,
    CONSTRAINT "EachAffrimation_affrimationsId_fkey" FOREIGN KEY ("affrimationsId") REFERENCES "Affrimations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_EachAffrimation" ("affrimationsId", "id", "title") SELECT "affrimationsId", "id", "title" FROM "EachAffrimation";
DROP TABLE "EachAffrimation";
ALTER TABLE "new_EachAffrimation" RENAME TO "EachAffrimation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
