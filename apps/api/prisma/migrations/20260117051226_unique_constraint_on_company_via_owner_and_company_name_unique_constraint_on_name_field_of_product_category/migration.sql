/*
  Warnings:

  - You are about to drop the column `category` on the `ProductCategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,ownerId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "category",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_ownerId_key" ON "Company"("name", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");
