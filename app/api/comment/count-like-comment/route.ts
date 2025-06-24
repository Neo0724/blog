import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";
import { checkToken } from "../../jwt/checkToken";

export const GET = checkToken(async (request: NextRequest) => {
  const comment_id = request.nextUrl.searchParams.get("comment_id");

  const prisma = prismaClient as PrismaClient;

  try {
    const totalLikedComment = await prisma.likedComment.count({
      where: {
        Comment_comment_id: comment_id as string,
      },
    });

    return NextResponse.json(totalLikedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
});
