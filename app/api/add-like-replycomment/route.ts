
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json()

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

    const [ returnedLikedCommentReply, totalLikedCommentReplyCount ]= await prisma.$transaction([
        prisma.likedCommentReply.create({ data: likedCommentReply }),
        prisma.likedCommentReply.count({
            where: {
                CommentReply_comment_reply_id: body.comment_reply_id as string
            }
        })

    ])

    return NextResponse.json({ totalLikedCommentReplyCount: totalLikedCommentReplyCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 }
    );
  }
}
