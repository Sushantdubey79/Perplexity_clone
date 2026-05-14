/*
  Warnings:

  - You are about to drop the column `superBaseId` on the `User` table. All the data in the column will be lost.
  - Added the required column `supaBaseId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "superBaseId",
ADD COLUMN     "supaBaseId" TEXT NOT NULL;
