import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const comment_id = request.nextUrl.searchParams.get("comment_id");

  const prisma = new PrismaClient();

  try {
      const totalLikedComment = await prisma.likedComment.count({
          where: {
              Comment_comment_id: comment_id as string
          }
      }) 


      return NextResponse.json(totalLikedComment, { status: 200 });
  } catch (error) {
      return NextResponse.json(
          { error: "An unexpected error occur!" },
          { status: 400 }
      );
  }
}
