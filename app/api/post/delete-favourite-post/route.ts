import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function DELETE(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  const post_id = request.nextUrl.searchParams.get("post_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const deletedFavouritedPost = await prisma.favouritePost.delete({
      where: {
        User_user_id_Post_post_id: {
          User_user_id: user_id as string,
          Post_post_id: post_id as string,
        },
      },
    });

    return NextResponse.json({ deletedFavouritedPost }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
