import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  try {
    const allFavouritedPost = await prisma.favouritePost.findMany({
      where: {
        User_user_id: user_id as string,
      },

      select: {
        Post: {
          select: {
            title: true,
            content: true,
            createdAt: true,
            post_id: true,
            User: {
              select: {
                name: true,
                user_id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let allPostsWithDateDiff = allFavouritedPost?.map((curPost) => {
      let dateDiff = getDateDifference(curPost.Post.createdAt);

      return { Post: { ...curPost.Post, dateDifferent: dateDiff } };
    });
    /* 
   [
    {
        "Post": {
            "title": "Coding help",
            "content": "Can someone help me in next js?",
            "createdAt": "2024-10-17T10:16:52.627Z",
            "post_id": "20ee24c5-9d2f-440e-aab6-da49de8bc92e",
            "User": {
                "name": "Alan",
                "user_id": "3b043e4d-3d8d-414d-8dd8-b2ce0be44c25"
            }
        }
    }
] 
    Example output, returned output is an array of all favourited post 
    */
    return NextResponse.json(allPostsWithDateDiff ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
