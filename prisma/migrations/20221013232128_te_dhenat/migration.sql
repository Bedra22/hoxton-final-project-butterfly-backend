-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "Date" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyChallenges" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "challenge" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "VisionBoard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "VisionBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Affrimations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Affrimations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EachAffrimation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "affrimationsId" INTEGER,
    CONSTRAINT "EachAffrimation_affrimationsId_fkey" FOREIGN KEY ("affrimationsId") REFERENCES "Affrimations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EachAffrimationSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "voice" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "eachAffrimationId" INTEGER,
    CONSTRAINT "EachAffrimationSection_eachAffrimationId_fkey" FOREIGN KEY ("eachAffrimationId") REFERENCES "EachAffrimation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Meditation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Meditation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EachMeditationSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "meditationId" INTEGER,
    CONSTRAINT "EachMeditationSection_meditationId_fkey" FOREIGN KEY ("meditationId") REFERENCES "Meditation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OneSeactionOfMeditations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "voice" TEXT NOT NULL,
    "eachMeditationSectionId" INTEGER,
    CONSTRAINT "OneSeactionOfMeditations_eachMeditationSectionId_fkey" FOREIGN KEY ("eachMeditationSectionId") REFERENCES "EachMeditationSection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DailyChallengesToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DailyChallengesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "DailyChallenges" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DailyChallengesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_DailyChallengesToUser_AB_unique" ON "_DailyChallengesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DailyChallengesToUser_B_index" ON "_DailyChallengesToUser"("B");
