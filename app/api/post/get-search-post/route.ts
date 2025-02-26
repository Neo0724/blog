import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";
import prismaClient from "../../getPrismaClient";

export const GET = async (req: NextRequest) => {
  const prisma = prismaClient as PrismaClient;
  const searchText = req.nextUrl.searchParams.get("searchText");

  try {
    const allPosts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: searchText as string } },
          { content: { contains: searchText as string } },
          { User: { name: { contains: searchText as string } } },
        ],
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
    });

    let allPostsWithDateDiff = allPosts?.map((post) => {
      let dateDiff = getDateDifference(post.createdAt);

      return { ...post, dateDifferent: dateDiff };
    });

    return NextResponse.json(allPostsWithDateDiff ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search the post. Please try again later" },
      { status: 500 }
    );
  }
};
