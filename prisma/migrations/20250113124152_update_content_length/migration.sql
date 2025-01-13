-- AlterTable
ALTER TABLE `comment` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `commentreply` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `post` MODIFY `content` TEXT NOT NULL;
