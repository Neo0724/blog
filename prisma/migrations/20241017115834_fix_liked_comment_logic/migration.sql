/*
  Warnings:

  - The primary key for the `likedcomment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Post_post_id` on the `likedcomment` table. All the data in the column will be lost.
  - Added the required column `Comment_comment_id` to the `LikedComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `likedcomment` DROP FOREIGN KEY `LikedComment_Post_post_id_fkey`;

-- AlterTable
ALTER TABLE `likedcomment` DROP PRIMARY KEY,
    DROP COLUMN `Post_post_id`,
    ADD COLUMN `Comment_comment_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`User_user_id`, `Comment_comment_id`);

-- AddForeignKey
ALTER TABLE `LikedComment` ADD CONSTRAINT `LikedComment_Comment_comment_id_fkey` FOREIGN KEY (`Comment_comment_id`) REFERENCES `Comment`(`comment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
