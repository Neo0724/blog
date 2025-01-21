import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  const post_id = request.nextUrl.searchParams.get("post_id");

  try {
    const allLikedComment = await prisma.user.findUnique({
      where: {
        user_id: user_id as string,
        liked_comment: {
          some: {
            Comment: {
              Post_post_id: post_id as string,
            },
          },
        },
      },

      select: {
        liked_comment: {
          select: {
            Comment_comment_id: true,
          },
        },
      },
    });

    /* 
    [
      {
          "Comment_comment_id": "707e91c1-f8e8-4fe5-8d50-b0a6a07468bf"
      }
    ]
    
    Example output, returned output is an array of all liked comment id within a post
    */
    return NextResponse.json(allLikedComment?.liked_comment ?? [], {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
