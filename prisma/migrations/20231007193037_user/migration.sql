/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT
);
INSERT INTO "new_User" ("createdAt", "email", "id", "image", "name", "updatedAt") SELECT "createdAt", "email", "id", "image", "name", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new__ChatToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ChatToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ChatToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__ChatToUser" ("A", "B") SELECT "A", "B" FROM "_ChatToUser";
DROP TABLE "_ChatToUser";
ALTER TABLE "new__ChatToUser" RENAME TO "_ChatToUser";
CREATE UNIQUE INDEX "_ChatToUser_AB_unique" ON "_ChatToUser"("A", "B");
CREATE INDEX "_ChatToUser_B_index" ON "_ChatToUser"("B");
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "body" TEXT NOT NULL,
    "chatId" INTEGER,
    "authorId" TEXT,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("authorId", "body", "chatId", "createdAt", "id", "updatedAt") SELECT "authorId", "body", "chatId", "createdAt", "id", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");
CREATE INDEX "Message_authorId_idx" ON "Message"("authorId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
