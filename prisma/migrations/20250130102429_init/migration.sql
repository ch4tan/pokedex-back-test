/*
  Warnings:

  - Added the required column `hp` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `hp` INTEGER NOT NULL,
    ADD COLUMN `total` INTEGER NOT NULL;
