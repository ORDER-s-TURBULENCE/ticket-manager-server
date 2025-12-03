/*
  Warnings:

  - You are about to drop the column `type` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `movie_id` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('staff', 'crowdfunding', 'preorder', 'onTheDay');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "movie_id" TEXT NOT NULL,
ADD COLUMN     "type" "FormType" NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "type";

-- DropEnum
DROP TYPE "TicketType";

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
