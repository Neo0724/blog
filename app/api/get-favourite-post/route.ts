import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  try {
    const allFavouritedPost = await prisma.favouritePost.findMany({
      where: {
        User: {
          user_id: user_id as string,
        },
      },
      select: {
        Post_post_id: true,
      },
    });

    /* 
    [
      {
          "Post_post_id": "707e91c1-f8e8-4fe5-8d50-b0a6a07468bf"
      }
    ]
    
    Example output, returned output is an array of all liked comment id within a post
    */
    console.log(allFavouritedPost);
    return NextResponse.json(allFavouritedPost ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 },
    );
  }
}
