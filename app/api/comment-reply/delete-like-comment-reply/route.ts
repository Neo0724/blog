import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  const comment_reply_id = request.nextUrl.searchParams.get("comment_reply_id");

  const prisma = new PrismaClient();
  try {
    const [deletedLikedComment, likeCount] = await prisma.$transaction([
      prisma.likedCommentReply.delete({
        where: {
          User_user_id_CommentReply_comment_reply_id: {
            User_user_id: user_id as string,
            CommentReply_comment_reply_id: comment_reply_id as string,
          },
        },
      }),

      prisma.likedCommentReply.count({
        where: {
          CommentReply_comment_reply_id: comment_reply_id as string,
        },
      }),
    ]);

    return NextResponse.json(
      {
        commentReplyId: deletedLikedComment.CommentReply_comment_reply_id,
        likeCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
