-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoastedDesigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalImageUrl" TEXT NOT NULL,
    "improvedHtml" TEXT NOT NULL,
    "improvedReact" TEXT NOT NULL,
    "improvements" TEXT NOT NULL DEFAULT '[]',
    "whatsWrong" TEXT NOT NULL DEFAULT '[]',
    "uiHighlights" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RoastedDesigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RoastedDesigns" ("createdAt", "id", "improvedHtml", "improvedReact", "improvements", "name", "originalImageUrl", "updatedAt", "userId", "whatsWrong") SELECT "createdAt", "id", "improvedHtml", "improvedReact", "improvements", "name", "originalImageUrl", "updatedAt", "userId", "whatsWrong" FROM "RoastedDesigns";
DROP TABLE "RoastedDesigns";
ALTER TABLE "new_RoastedDesigns" RENAME TO "RoastedDesigns";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
