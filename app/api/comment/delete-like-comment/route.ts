import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";
import { checkToken } from "../../jwt/checkToken";

export const DELETE = checkToken(async (request: NextRequest) => {
  const user_id = request.nextUrl.searchParams.get("user_id");
  const comment_id = request.nextUrl.searchParams.get("comment_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const [deletedComment, likeCount] = await prisma.$transaction([
      prisma.likedComment.delete({
        where: {
          User_user_id_Comment_comment_id: {
            Comment_comment_id: comment_id as string,
            User_user_id: user_id as string,
          },
        },
      }),

      prisma.likedComment.count({
        where: {
          Comment_comment_id: comment_id as string,
        },
      }),
    ]);

    return NextResponse.json(
      { commentId: deletedComment.Comment_comment_id, likeCount },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
});
