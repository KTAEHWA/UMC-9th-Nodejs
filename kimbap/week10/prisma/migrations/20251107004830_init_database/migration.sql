/*
  Warnings:

  - You are about to alter the column `birthdate` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
*/
-- AlterTable
ALTER TABLE `User` MODIFY `birthdate` TIMESTAMP NOT NULL;

