import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/(util)/getDateDifference";

export async function GET(request: NextRequest) {
  const comment_id = request.nextUrl.searchParams.get("comment_id");

  const prisma = new PrismaClient();

  try {
    const replyComments = await prisma.comment.findUnique({
      where: {
        comment_id: comment_id as string,
      },
      select: {
        being_replied_comment: {
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
            createdAt: "asc",
          },
        },
      },
    });

    let replyCommentWithDateDifferent =
      replyComments?.being_replied_comment?.map((replyComment) => {
        return {
          ...replyComment,
          dateDifferent: getDateDifference(replyComment.createdAt),
        };
      });

    console.log(replyCommentWithDateDifferent);

    return NextResponse.json(replyCommentWithDateDifferent ?? [], {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 },
    );
  }
}
