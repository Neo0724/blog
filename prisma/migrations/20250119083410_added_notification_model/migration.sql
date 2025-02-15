-- CreateTable
CREATE TABLE `Notification` (
    `notification_id` VARCHAR(191) NOT NULL,
    `TargetUserId` VARCHAR(191) NOT NULL,
    `FromUserId` VARCHAR(191) NOT NULL,
    `type` ENUM('LIKE_POST', 'LIKE_COMMENT', 'LIKE_REPLY_COMMENT', 'POST', 'COMMENT', 'COMMENT_REPLY', 'FOLLOW') NOT NULL,
    `resourceId` VARCHAR(191) NOT NULL,
    `hasViewed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_TargetUserId_fkey` FOREIGN KEY (`TargetUserId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_FromUserId_fkey` FOREIGN KEY (`FromUserId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
