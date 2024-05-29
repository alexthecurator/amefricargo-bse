/*
  Warnings:

  - Made the column `password` on table `Password` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Password" ALTER COLUMN "password" SET NOT NULL;
