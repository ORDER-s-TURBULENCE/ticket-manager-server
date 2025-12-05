-- AlterTable
ALTER TABLE "PaymentLink" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
