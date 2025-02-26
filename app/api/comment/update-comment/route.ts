import { getDateDifference } from "@/app/_util/getDateDifference";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function PUT(request: NextRequest) {
  const { comment_id, content } = await request.json();

  const prisma = prismaClient as PrismaClient;

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        comment_id: comment_id as string,
      },
      data: {
        content: content as string,
      },
      select: {
        comment_id: true,
        content: true,
        createdAt: true,
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
    });

    const updatedCommentWithDateDifferent = {
      ...updatedComment,
      dateDifferent: getDateDifference(updatedComment.createdAt),
    };

    return NextResponse.json(
      { updatedComment: updatedCommentWithDateDifferent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
