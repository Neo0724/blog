import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const comment_reply_id = request.nextUrl.searchParams.get("comment_reply_id");

  const prisma = new PrismaClient();
  try {
    const deletedCommentReply = await prisma.commentReply.delete({
      where: {
        comment_reply_id: comment_reply_id as string,
      },
    });

    return NextResponse.json(
      { deletedCommentReply: deletedCommentReply },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 },
    );
  }
}
