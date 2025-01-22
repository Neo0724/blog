import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";

export async function GET(request: NextRequest) {
  const commentReplyId = request.nextUrl.searchParams.get("comment_reply_id");

  const prisma = new PrismaClient();

  try {
    const replyComments = await prisma.commentReply.findUnique({
      where: {
        comment_reply_id: commentReplyId as string,
      },
      select: {
        Comment: {
          select: {
            comment_id: true,
            Post: {
              select: {
                post_id: true,
              },
            },
          },
        },
      },
    });

    if (!replyComments) {
      return NextResponse.json(
        {
          message:
            "Failed to fetch the post id and comment id with the given comment reply id",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        post_id: replyComments.Comment.Post.post_id,
        comment_id: replyComments.Comment.comment_id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch the comment's replies. Please try again later",
      },
      { status: 500 }
    );
  }
}
