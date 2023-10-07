/*
  Warnings:

  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `authorId` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "_ChatToUser_B_index";

-- DropIndex
DROP INDEX "_ChatToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatToUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "authorEmail" TEXT,
    CONSTRAINT "Chat_authorEmail_fkey" FOREIGN KEY ("authorEmail") REFERENCES "User" ("email") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "body" TEXT NOT NULL,
    "chatId" INTEGER,
    "authorEmail" TEXT,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_authorEmail_fkey" FOREIGN KEY ("authorEmail") REFERENCES "User" ("email") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("body", "chatId", "createdAt", "id", "updatedAt") SELECT "body", "chatId", "createdAt", "id", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");
CREATE INDEX "Message_authorEmail_idx" ON "Message"("authorEmail");
CREATE TABLE "new_User" (
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "username" TEXT,
    "image" TEXT
);
INSERT INTO "new_User" ("createdAt", "email", "image", "updatedAt", "username") SELECT "createdAt", "email", "image", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
