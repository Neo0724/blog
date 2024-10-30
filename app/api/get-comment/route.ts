import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const post_id = request.nextUrl.searchParams.get("post_id");
  const user_id = request.nextUrl.searchParams.get("user_id");

  const prisma = new PrismaClient();

  try {
    const commentsByLoggedInUser = await prisma.post.findUnique({
      where: {
        post_id: post_id as string,
        User_user_id: user_id as string,
      },
      select: {
        being_commented_post: {
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
            createdAt: "asc",
          },
        },
      },
    });

    const remainingComments = await prisma.post.findUnique({
      where: {
        post_id: post_id as string,
        User_user_id: { not: user_id as string },
      },
      select: {
        being_commented_post: {
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
            createdAt: "asc",
          },
        },
      },
    });

    const comments = [
      ...(commentsByLoggedInUser?.being_commented_post ?? []),
      ...(remainingComments?.being_commented_post ?? []),
    ];

    return NextResponse.json(comments ?? [], {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 },
    );
  }
}
