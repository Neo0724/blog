import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const prisma = prismaClient as PrismaClient;
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
    });

    return NextResponse.json(
      { newFavouritePost: returnedFavouritedPost.Post },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
