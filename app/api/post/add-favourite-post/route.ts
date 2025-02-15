import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const prisma = new PrismaClient();
  try {
    const likedPost: Prisma.FavouritePostCreateInput = {
      Post: {
        connect: {
          post_id: body.post_id as string,
        },
      },
      User: {
        connect: {
          user_id: body.user_id as string,
        },
      },
    };

    const returnedFavouritedPost = await prisma.favouritePost.create({
      data: likedPost,
    });

    return NextResponse.json(
      { favouritePost: returnedFavouritedPost },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
