import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";
import prismaClient from "../../getPrismaClient";

export async function GET(request: NextRequest) {
  const post_id = request.nextUrl.searchParams.get("post_id");
  const user_id = request.nextUrl.searchParams.get("user_id");
  const skipComment = request.nextUrl.searchParams.get("skipComment");
  const limitComment = request.nextUrl.searchParams.get("limitComment");

  const prisma = prismaClient as PrismaClient;

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
      skip: parseInt(skipComment as string) * parseInt(limitComment as string),
      take: parseInt(limitComment as string),
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
      skip: parseInt(skipComment as string) * parseInt(limitComment as string),
      take: parseInt(limitComment as string),
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
