import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  const post_id = request.nextUrl.searchParams.get("post_id");

  const prisma = new PrismaClient();
  try {
    const [deletedLikedComment, totalPostLikeCount] = await prisma.$transaction(
      [
        prisma.likedPost.delete({
          where: {
            User_user_id_Post_post_id: {
              Post_post_id: post_id as string,
              User_user_id: user_id as string,
            },
          },
        }),

        prisma.likedPost.count({
          where: {
            Post_post_id: post_id as string,
          },
        }),
      ],
    );

    return NextResponse.json(
      { totalPostLikeCount: totalPostLikeCount },
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
