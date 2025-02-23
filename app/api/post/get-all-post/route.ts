import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";

export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();
  const skipPost = req.nextUrl.searchParams.get("skipPost");
  const limitPost = req.nextUrl.searchParams.get("limitPost");

  try {
    const allPosts = await prisma.post.findMany({
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
      skip: parseInt(skipPost as string) * parseInt(limitPost as string),
      take: parseInt(limitPost as string),
    });

    let allPostsWithDateDiff = allPosts?.map((post) => {
      let dateDiff = getDateDifference(post.createdAt);

      return { ...post, dateDifferent: dateDiff };
    });

    return NextResponse.json(allPostsWithDateDiff ?? [], { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch all the posts. Please try again later" },
      { status: 500 }
    );
  }
};
