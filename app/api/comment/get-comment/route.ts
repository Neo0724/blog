import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";

export async function GET(request: NextRequest) {
  const post_id = request.nextUrl.searchParams.get("post_id");
  const user_id = request.nextUrl.searchParams.get("user_id");

  const prisma = new PrismaClient();

  try {
    // Fetch the user comment first then only the rest to put user comments on top of others
    const commentsByLoggedInUser = await prisma.comment.findMany({
      where: {
        Post_post_id: post_id as string,
        User_user_id: user_id as string,
      },
      select: {
        comment_id: true,
        content: true,
        createdAt: true,
        User: {
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

    const remainingComments = await prisma.comment.findMany({
      where: {
        Post_post_id: post_id as string,
        User_user_id: { not: user_id as string },
      },
      select: {
        comment_id: true,
        content: true,
        createdAt: true,
        User: {
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

    const comments = [
      ...(commentsByLoggedInUser ?? []),
      ...(remainingComments ?? []),
    ];

    let commentsWithDateDifferent = comments?.map((comment) => {
      return {
        ...comment,
        dateDifferent: getDateDifference(comment.createdAt),
      };
    });

    return NextResponse.json(commentsWithDateDifferent ?? [], {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch the comment. Please try again later" },
      { status: 500 }
    );
  }
}
