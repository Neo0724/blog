import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function DELETE(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  const post_id = request.nextUrl.searchParams.get("post_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const [deletedLikedPostId, likeCount] = await prisma.$transaction([
      prisma.likedPost.delete({
        where: {
          User_user_id_Post_post_id: {
            Post_post_id: post_id as string,
            User_user_id: user_id as string,
          },
        },
        select: {
          Post_post_id: true,
        },
      }),

      prisma.likedPost.count({
        where: {
          Post_post_id: post_id as string,
        },
      }),
    ]);

    return NextResponse.json(
      { postId: deletedLikedPostId.Post_post_id, likeCount },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
