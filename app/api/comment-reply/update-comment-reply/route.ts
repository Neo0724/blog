import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const replyComment = await request.json();

  const prisma = new PrismaClient();

  try {
    const updatedCommentReply = await prisma.commentReply.update({
      where: {
        comment_reply_id: replyComment.comment_reply_id as string,
      },
      data: {
        content: replyComment.content as string,
      },
      select: {
        comment_reply_id: true,
        content: true,
        User: {
          select: {
            name: true,
            user_id: true,
          },
        },
        Target_user: {
          select: {
            name: true,
            user_id: true,
          },
        },
      },
    });

    return NextResponse.json(
      { updatedCommentReply: updatedCommentReply },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
