-- SQLite version
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "subscription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("subscription") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Copy the data
INSERT INTO "new_User" ("id", "name", "email", "emailVerified", "image", "subscription", "createdAt", "updatedAt")
SELECT "id", "name", "email", "emailVerified", "image", "subscriptionId", "createdAt", "updatedAt"
FROM "User";

-- Drop the old table
DROP TABLE "User";

-- Rename the new table to the old table's name
ALTER TABLE "new_User" RENAME TO "User";

-- Recreate the unique index if it existed
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email"); 