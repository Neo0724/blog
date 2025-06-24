import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";
import prismaClient from "../../getPrismaClient";
import { checkToken } from "../../jwt/checkToken";

export const GET = checkToken(async (request: NextRequest) => {
  const prisma = prismaClient as PrismaClient;

  const user_id = request.nextUrl.searchParams.get("user_id");
  const skipPost = request.nextUrl.searchParams.get("skipPost");
  const limitPost = request.nextUrl.searchParams.get("limitPost");

  try {
    // Add validation for required parameters
    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    // Set default values and validate numeric parameters
    const skip = skipPost ? parseInt(skipPost) : 0;
    const limit = limitPost ? parseInt(limitPost) : 10;

    if (isNaN(skip) || isNaN(limit) || skip < 0 || limit <= 0) {
      return NextResponse.json(
        { error: "Invalid skip or limit parameters" },
        { status: 400 }
      );
    }

    const allFavouritedPost = await prisma.favouritePost.findMany({
      where: {
        User_user_id: user_id,
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
      skip: skip * limit, // Fixed calculation
      take: limit,
    });

    // Handle case where no posts are found
    if (!allFavouritedPost || allFavouritedPost.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const allPostsWithDateDiff = allFavouritedPost.map((curPost) => {
      const dateDiff = getDateDifference(curPost.Post.createdAt);
      return {
        ...curPost.Post,
        dateDifferent: dateDiff,
      };
    });

    return NextResponse.json(allPostsWithDateDiff, { status: 200 });
  } catch (error) {
    console.error("Error fetching favourited posts:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred!" },
      { status: 500 }
    );
  }
});

// export async function GET(request: NextRequest) {
// }
