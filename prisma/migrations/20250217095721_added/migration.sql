-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_Post_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_User_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `commentreply` DROP FOREIGN KEY `CommentReply_Comment_comment_id_fkey`;

-- DropForeignKey
ALTER TABLE `commentreply` DROP FOREIGN KEY `CommentReply_Target_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `commentreply` DROP FOREIGN KEY `CommentReply_User_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `favouritepost` DROP FOREIGN KEY `FavouritePost_Post_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `favouritepost` DROP FOREIGN KEY `FavouritePost_User_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `follower` DROP FOREIGN KEY `Follower_User_following_id_fkey`;

-- DropForeignKey
ALTER TABLE `follower` DROP FOREIGN KEY `Follower_User_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `likedcomment` DROP FOREIGN KEY `LikedComment_Comment_comment_id_fkey`;

-- DropForeignKey
ALTER TABLE `likedcomment` DROP FOREIGN KEY `LikedComment_User_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `likedcommentreply` DROP FOREIGN KEY `LikedCommentReply_CommentReply_comment_reply_id_fkey`;

-- DropForeignKey
ALTER TABLE `likedcommentreply` DROP FOREIGN KEY `LikedCommentReply_User_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `likedpost` DROP FOREIGN KEY `LikedPost_Post_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `likedpost` DROP FOREIGN KEY `LikedPost_User_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_FromUserId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_TargetUserId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_User_user_id_fkey`;

-- DropIndex
DROP INDEX `Comment_Post_post_id_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Comment_User_user_id_fkey` ON `comment`;

-- DropIndex
DROP INDEX `CommentReply_Comment_comment_id_fkey` ON `commentreply`;

-- DropIndex
DROP INDEX `CommentReply_Target_user_id_fkey` ON `commentreply`;

-- DropIndex
DROP INDEX `CommentReply_User_user_id_fkey` ON `commentreply`;

-- DropIndex
DROP INDEX `FavouritePost_Post_post_id_fkey` ON `favouritepost`;

-- DropIndex
DROP INDEX `Follower_User_following_id_fkey` ON `follower`;

-- DropIndex
DROP INDEX `LikedComment_Comment_comment_id_fkey` ON `likedcomment`;

-- DropIndex
DROP INDEX `LikedCommentReply_CommentReply_comment_reply_id_fkey` ON `likedcommentreply`;

-- DropIndex
DROP INDEX `LikedPost_Post_post_id_fkey` ON `likedpost`;

-- DropIndex
DROP INDEX `Notification_FromUserId_fkey` ON `notification`;

-- DropIndex
DROP INDEX `Notification_TargetUserId_fkey` ON `notification`;

-- DropIndex
DROP INDEX `Post_User_user_id_fkey` ON `post`;

-- AddForeignKey
ALTER TABLE `Follower` ADD CONSTRAINT `Follower_User_owner_id_fkey` FOREIGN KEY (`User_owner_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD CONSTRAINT `Follower_User_following_id_fkey` FOREIGN KEY (`User_following_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_TargetUserId_fkey` FOREIGN KEY (`TargetUserId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_FromUserId_fkey` FOREIGN KEY (`FromUserId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavouritePost` ADD CONSTRAINT `FavouritePost_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavouritePost` ADD CONSTRAINT `FavouritePost_Post_post_id_fkey` FOREIGN KEY (`Post_post_id`) REFERENCES `Post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedPost` ADD CONSTRAINT `LikedPost_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedPost` ADD CONSTRAINT `LikedPost_Post_post_id_fkey` FOREIGN KEY (`Post_post_id`) REFERENCES `Post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_Post_post_id_fkey` FOREIGN KEY (`Post_post_id`) REFERENCES `Post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedComment` ADD CONSTRAINT `LikedComment_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedComment` ADD CONSTRAINT `LikedComment_Comment_comment_id_fkey` FOREIGN KEY (`Comment_comment_id`) REFERENCES `Comment`(`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentReply` ADD CONSTRAINT `CommentReply_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentReply` ADD CONSTRAINT `CommentReply_Comment_comment_id_fkey` FOREIGN KEY (`Comment_comment_id`) REFERENCES `Comment`(`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentReply` ADD CONSTRAINT `CommentReply_Target_user_id_fkey` FOREIGN KEY (`Target_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedCommentReply` ADD CONSTRAINT `LikedCommentReply_User_user_id_fkey` FOREIGN KEY (`User_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedCommentReply` ADD CONSTRAINT `LikedCommentReply_CommentReply_comment_reply_id_fkey` FOREIGN KEY (`CommentReply_comment_reply_id`) REFERENCES `CommentReply`(`comment_reply_id`) ON DELETE CASCADE ON UPDATE CASCADE;
