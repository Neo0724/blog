import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/(util)/getDateDifference";
export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  const user_id = req.nextUrl.searchParams.get("user_id");

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
    });

    let userPostsWithDateDiff = userPosts?.map((post) => {
      let dateDiff = getDateDifference(post.createdAt);

      return { ...post, dateDifferent: dateDiff };
    });

    return NextResponse.json(userPostsWithDateDiff ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 400 });
  }
};
