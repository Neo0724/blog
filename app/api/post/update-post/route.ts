import { getDateDifference } from "@/app/_util/getDateDifference";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";
import { checkToken } from "../../jwt/checkToken";

export const PUT = checkToken(async (request: NextRequest) => {
  const { postId, title, content } = await request.json();

  const prisma = prismaClient as PrismaClient;

  try {
    const updatedPost = await prisma.post.update({
      where: {
        post_id: postId as string,
      },
      data: {
        title: title as string,
        content: content as string,
      },
      select: {
        title: true,
        content: true,
        createdAt: true,
        post_id: true,
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
    });

    const newPostWithDateDifferent = {
      ...updatedPost,
      dateDifferent: getDateDifference(updatedPost.createdAt),
    };

    return NextResponse.json(
      { updatedPost: newPostWithDateDifferent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
});
