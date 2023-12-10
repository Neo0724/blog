/*
  Warnings:

  - You are about to drop the `_categorytopost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userpreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_categorytopost` DROP FOREIGN KEY `_CategoryToPost_A_fkey`;

-- DropForeignKey
ALTER TABLE `_categorytopost` DROP FOREIGN KEY `_CategoryToPost_B_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_favoritedById_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_UserPreferenceId_fkey`;

-- DropTable
DROP TABLE `_categorytopost`;

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userpreference`;
