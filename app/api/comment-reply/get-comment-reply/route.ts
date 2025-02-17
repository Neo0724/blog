import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";

export async function GET(request: NextRequest) {
  const comment_id = request.nextUrl.searchParams.get("comment_id");
  const user_id = request.nextUrl.searchParams.get("user_id");

  const prisma = new PrismaClient();

  try {
    const replyCommentsByLoggedInUser = await prisma.commentReply.findMany({
      where: {
        Comment_comment_id: comment_id as string,
        User_user_id: user_id as string,
      },
      select: {
        comment_reply_id: true,
        content: true,
        createdAt: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const replyCommentsExcludeLoggedInUser = await prisma.commentReply.findMany(
      {
        where: {
          Comment_comment_id: comment_id as string,
          User_user_id: {
            not: user_id as string,
          },
        },
        select: {
          comment_reply_id: true,
          content: true,
          createdAt: true,
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
        orderBy: {
          createdAt: "desc",
        },
      }
    );

    const allReplyComments = [
      ...(replyCommentsByLoggedInUser ?? []),
      ...(replyCommentsExcludeLoggedInUser ?? []),
    ];

    let replyCommentWithDateDifferent = allReplyComments?.map(
      (replyComment) => {
        return {
          ...replyComment,
          dateDifferent: getDateDifference(replyComment.createdAt),
        };
      }
    );

    return NextResponse.json(
      { allCommentReply: replyCommentWithDateDifferent ?? [] },
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
