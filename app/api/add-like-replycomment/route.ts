import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../getPrismaClient";
import { checkToken } from "../jwt/checkToken";

export const POST = checkToken(async (request: NextRequest) => {
  const commentReplyId = request.nextUrl.searchParams.get("comment_reply_id");
  const userId = request.nextUrl.searchParams.get("user_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const likedCommentReply: Prisma.LikedCommentReplyCreateInput = {
      CommentReply: {
        connect: {
          comment_reply_id: commentReplyId as string,
        },
      },
      User: {
        connect: {
          user_id: userId as string,
        },
      },
    };

    const [returnedLikedCommentReply, likeCount] = await prisma.$transaction([
      prisma.likedCommentReply.create({ data: likedCommentReply }),
      prisma.likedCommentReply.count({
        where: {
          CommentReply_comment_reply_id: commentReplyId as string,
        },
      }),
    ]);

    return NextResponse.json(
      {
        commentReplyId: returnedLikedCommentReply.CommentReply_comment_reply_id,
        likeCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
});
