/*
  Warnings:

  - You are about to drop the column `number_of_tickets` on the `Form` table. All the data in the column will be lost.
  - Added the required column `number_of_goods_tickets` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "number_of_tickets",
ADD COLUMN     "number_of_goods_tickets" INTEGER NOT NULL;
