import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";
export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  const user_id = req.nextUrl.searchParams.get("user_id");
  const skipPost = req.nextUrl.searchParams.get("skipPost");
  const limitPost = req.nextUrl.searchParams.get("limitPost");

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        User_user_id: user_id as string,
      },

      select: {
        title: true,
        content: true,
        createdAt: true,
        post_id: true,
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip:
        parseInt(skipPost as string) ?? 0 * parseInt(limitPost as string) ?? 10,
      take: parseInt(limitPost as string) ?? 10,
    });

    let userPostsWithDateDiff = userPosts?.map((post) => {
      let dateDiff = getDateDifference(post.createdAt);

      return { ...post, dateDifferent: dateDiff };
    });

    return NextResponse.json(userPostsWithDateDiff ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch the user post. Please try again later" },
      { status: 500 }
    );
  }
};
