-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type1` VARCHAR(191) NULL,
    `type2` VARCHAR(191) NULL,
    `attack` INTEGER NOT NULL,
    `defense` INTEGER NOT NULL,
    `spatk` INTEGER NOT NULL,
    `spdef` INTEGER NOT NULL,
    `speed` INTEGER NOT NULL,
    `generation` INTEGER NOT NULL,

    UNIQUE INDEX `User_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
