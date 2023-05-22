/*
  Warnings:

  - You are about to drop the column `productId` on the `Coupon` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_productId_fkey";

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "productId";
