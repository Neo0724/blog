import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";

export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();

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
    });

    let allPostsWithDateDiff = allPosts?.map((post) => {
      let dateDiff = getDateDifference(post.createdAt);

      return { ...post, dateDifferent: dateDiff };
    });

    return NextResponse.json(allPostsWithDateDiff ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 400 });
  }
};
