-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "deletedAt" DROP NOT NULL;
