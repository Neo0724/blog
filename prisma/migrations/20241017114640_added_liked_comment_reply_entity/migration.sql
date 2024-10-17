-- CreateTable
CREATE TABLE `LikedCommentReply` (
    `User_user_id` VARCHAR(191) NOT NULL,
    `CommentReply_comment_reply_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`User_user_id`, `CommentReply_comment_reply_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LikedCommentReply` ADD CONSTRAINT `LikedCommentReply_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedCommentReply` ADD CONSTRAINT `LikedCommentReply_CommentReply_comment_reply_id_fkey` FOREIGN KEY (`CommentReply_comment_reply_id`) REFERENCES `CommentReply`(`comment_reply_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
