-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE_POST', 'LIKE_COMMENT', 'LIKE_REPLY_COMMENT', 'POST', 'COMMENT', 'COMMENT_REPLY', 'FOLLOW');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "User_owner_id" TEXT NOT NULL,
    "User_following_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("User_owner_id","User_following_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "TargetUserId" TEXT NOT NULL,
    "FromUserId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "resourceId" TEXT NOT NULL,
    "hasViewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "post_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "User_user_id" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "FavouritePost" (
    "User_user_id" TEXT NOT NULL,
    "Post_post_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavouritePost_pkey" PRIMARY KEY ("User_user_id","Post_post_id")
);

-- CreateTable
CREATE TABLE "LikedPost" (
    "User_user_id" TEXT NOT NULL,
    "Post_post_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LikedPost_pkey" PRIMARY KEY ("User_user_id","Post_post_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "comment_id" TEXT NOT NULL,
    "User_user_id" TEXT NOT NULL,
    "Post_post_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "LikedComment" (
    "User_user_id" TEXT NOT NULL,
    "Comment_comment_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LikedComment_pkey" PRIMARY KEY ("User_user_id","Comment_comment_id")
);

-- CreateTable
CREATE TABLE "CommentReply" (
    "comment_reply_id" TEXT NOT NULL,
    "User_user_id" TEXT NOT NULL,
    "Comment_comment_id" TEXT NOT NULL,
    "Target_user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,

    CONSTRAINT "CommentReply_pkey" PRIMARY KEY ("comment_reply_id")
);

-- CreateTable
CREATE TABLE "LikedCommentReply" (
    "User_user_id" TEXT NOT NULL,
    "CommentReply_comment_reply_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LikedCommentReply_pkey" PRIMARY KEY ("User_user_id","CommentReply_comment_reply_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_User_owner_id_fkey" FOREIGN KEY ("User_owner_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_User_following_id_fkey" FOREIGN KEY ("User_following_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_TargetUserId_fkey" FOREIGN KEY ("TargetUserId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_FromUserId_fkey" FOREIGN KEY ("FromUserId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_User_user_id_fkey" FOREIGN KEY ("User_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouritePost" ADD CONSTRAINT "FavouritePost_User_user_id_fkey" FOREIGN KEY ("User_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouritePost" ADD CONSTRAINT "FavouritePost_Post_post_id_fkey" FOREIGN KEY ("Post_post_id") REFERENCES "Post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPost" ADD CONSTRAINT "LikedPost_User_user_id_fkey" FOREIGN KEY ("User_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPost" ADD CONSTRAINT "LikedPost_Post_post_id_fkey" FOREIGN KEY ("Post_post_id") REFERENCES "Post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_User_user_id_fkey" FOREIGN KEY ("User_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_Post_post_id_fkey" FOREIGN KEY ("Post_post_id") REFERENCES "Post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedComment" ADD CONSTRAINT "LikedComment_User_user_id_fkey" FOREIGN KEY ("User_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedComment" ADD CONSTRAINT "LikedComment_Comment_comment_id_fkey" FOREIGN KEY ("Comment_comment_id") REFERENCES "Comment"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_User_user_id_fkey" FOREIGN KEY ("User_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_Comment_comment_id_fkey" FOREIGN KEY ("Comment_comment_id") REFERENCES "Comment"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_Target_user_id_fkey" FOREIGN KEY ("Target_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedCommentReply" ADD CONSTRAINT "LikedCommentReply_User_user_id_fkey" FOREIGN KEY ("User_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedCommentReply" ADD CONSTRAINT "LikedCommentReply_CommentReply_comment_reply_id_fkey" FOREIGN KEY ("CommentReply_comment_reply_id") REFERENCES "CommentReply"("comment_reply_id") ON DELETE CASCADE ON UPDATE CASCADE;
