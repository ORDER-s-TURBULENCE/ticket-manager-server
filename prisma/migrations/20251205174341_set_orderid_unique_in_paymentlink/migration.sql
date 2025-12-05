/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `PaymentLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentLink_order_id_key" ON "PaymentLink"("order_id");
