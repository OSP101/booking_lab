/*
  Warnings:

  - You are about to drop the `Lab` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Lab`;

-- CreateTable
CREATE TABLE `Labs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `room` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
