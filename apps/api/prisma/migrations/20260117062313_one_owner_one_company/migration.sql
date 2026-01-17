/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Company_name_ownerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Company_ownerId_key" ON "Company"("ownerId");
