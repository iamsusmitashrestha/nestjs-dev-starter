/*
  Warnings:

  - You are about to drop the column `isOpen` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `operatingHours` on the `Business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "isOpen",
DROP COLUMN "operatingHours",
ADD COLUMN     "operatingTime" JSONB;
