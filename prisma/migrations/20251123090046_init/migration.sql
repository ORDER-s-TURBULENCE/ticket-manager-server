-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'paypay', 'bank_transfer');

-- CreateEnum
CREATE TYPE "PayMentStatus" AS ENUM ('not_contacted', 'pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "TicketPurpose" AS ENUM ('seat', 'goods', 'none');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('staff', 'crowdfunding', 'preorder', 'onTheDay');

-- CreateEnum
CREATE TYPE "SheetStatus" AS ENUM ('available', 'reserved', 'used');

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PayMentStatus" NOT NULL,
    "number_of_tickets" INTEGER NOT NULL,
    "number_of_seat_tickets" INTEGER NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "purpose" "TicketPurpose" NOT NULL,
    "type" "TicketType" NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "is_activated" BOOLEAN NOT NULL DEFAULT false,
    "sheet_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "col" INTEGER NOT NULL,
    "status" "SheetStatus" NOT NULL,
    "movie_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "onair" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_email_key" ON "Form"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_sheet_id_key" ON "Ticket"("sheet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_movie_id_row_col_key" ON "Sheet"("movie_id", "row", "col");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
