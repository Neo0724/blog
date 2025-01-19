/*
  Warnings:

  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commentreply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_User_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `commentreply` DROP FOREIGN KEY `CommentReply_Target_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `commentreply` DROP FOREIGN KEY `CommentReply_User_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_User_user_id_fkey`;

-- DropIndex
DROP INDEX `FavouritePost_Post_post_id_fkey` ON `FavouritePost`;

-- DropIndex
DROP INDEX `LikedComment_Comment_comment_id_fkey` ON `LikedComment`;

-- DropIndex
DROP INDEX `LikedCommentReply_CommentReply_comment_reply_id_fkey` ON `LikedCommentReply`;

-- DropIndex
DROP INDEX `LikedPost_Post_post_id_fkey` ON `LikedPost`;

-- DropTable
DROP TABLE `comment`;

-- DropTable
DROP TABLE `commentreply`;

-- DropTable
DROP TABLE `post`;

-- CreateTable
CREATE TABLE `Post` (
    `post_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `User_user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `comment_id` VARCHAR(191) NOT NULL,
    `User_user_id` VARCHAR(191) NOT NULL,
    `Post_post_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `content` TEXT NOT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentReply` (
    `comment_reply_id` VARCHAR(191) NOT NULL,
    `User_user_id` VARCHAR(191) NOT NULL,
    `Comment_comment_id` VARCHAR(191) NOT NULL,
    `Target_user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `content` TEXT NOT NULL,

    PRIMARY KEY (`comment_reply_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavouritePost` ADD CONSTRAINT `FavouritePost_Post_post_id_fkey` FOREIGN KEY (`Post_post_id`) REFERENCES `Post`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedPost` ADD CONSTRAINT `LikedPost_Post_post_id_fkey` FOREIGN KEY (`Post_post_id`) REFERENCES `Post`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_Post_post_id_fkey` FOREIGN KEY (`Post_post_id`) REFERENCES `Post`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedComment` ADD CONSTRAINT `LikedComment_Comment_comment_id_fkey` FOREIGN KEY (`Comment_comment_id`) REFERENCES `Comment`(`comment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentReply` ADD CONSTRAINT `CommentReply_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentReply` ADD CONSTRAINT `CommentReply_Comment_comment_id_fkey` FOREIGN KEY (`Comment_comment_id`) REFERENCES `Comment`(`comment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentReply` ADD CONSTRAINT `CommentReply_Target_user_id_fkey` FOREIGN KEY (`Target_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedCommentReply` ADD CONSTRAINT `LikedCommentReply_CommentReply_comment_reply_id_fkey` FOREIGN KEY (`CommentReply_comment_reply_id`) REFERENCES `CommentReply`(`comment_reply_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
