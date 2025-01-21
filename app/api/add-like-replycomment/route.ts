import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const prisma = new PrismaClient();
  try {
    const likedCommentReply: Prisma.LikedCommentReplyCreateInput = {
      CommentReply: {
        connect: {
          comment_reply_id: body.comment_reply_id as string,
        },
      },
      User: {
        connect: {
          user_id: body.user_id as string,
        },
      },
    };

    const [returnedLikedCommentReply] = await prisma.$transaction([
      prisma.likedCommentReply.create({ data: likedCommentReply }),
    ]);

    return NextResponse.json(
      { likedCommentReply: returnedLikedCommentReply },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
