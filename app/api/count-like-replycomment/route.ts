import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const comment_reply_id = request.nextUrl.searchParams.get("comment_reply_id");

  const prisma = new PrismaClient();

  try {
      const totalLikedCommentReplyCount = await prisma.likedCommentReply.count({
          where: {
              CommentReply_comment_reply_id: comment_reply_id as string
          }
      })



      return NextResponse.json(totalLikedCommentReplyCount, { status: 200 });

  } catch (error) {
      return NextResponse.json(
          { error: "An unexpected error occur!" },
          { status: 400 }
      );
  }
}
