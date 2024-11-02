-- CreateTable
CREATE TABLE "RoastedDesigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "originalImageUrl" TEXT NOT NULL,
    "improvedHtml" TEXT NOT NULL,
    "improvements" TEXT NOT NULL DEFAULT '[]',
    "whatsWrong" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RoastedDesigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
