import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";
import { checkToken } from "../../jwt/checkToken";

export const DELETE = checkToken(async (request: NextRequest) => {
  const comment_reply_id = request.nextUrl.searchParams.get("comment_reply_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const deletedCommentReply = await prisma.commentReply.delete({
      where: {
        comment_reply_id: comment_reply_id as string,
      },
    });

    return NextResponse.json(
      { deletedCommentReply: deletedCommentReply },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
});
