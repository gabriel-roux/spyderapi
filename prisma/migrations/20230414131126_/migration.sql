/*
  Warnings:

  - You are about to drop the column `complement` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "complement",
DROP COLUMN "number";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingStatus" TEXT;
