-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PLACED', 'CANCELLED', 'DELIVERED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PLACED';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "totalOrders" INTEGER NOT NULL DEFAULT 0;
