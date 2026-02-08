-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "tempPassword" TEXT,
ADD COLUMN     "tempPasswordTimestamp" TIMESTAMP(3);
