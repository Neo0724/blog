import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getDateDifference } from "@/app/_util/getDateDifference";
import prismaClient from "../../getPrismaClient";

export const GET = async (req: NextRequest) => {
  const prisma = prismaClient as PrismaClient;
  const post_id = req.nextUrl.searchParams.get("post_id");

  try {
    const uniquePost = await prisma.post.findUnique({
      where: {
        post_id: post_id as string,
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

    let uniquePostWithDateDiff;

    if (uniquePost) {
      let dateDiff = getDateDifference(uniquePost.createdAt);
      uniquePostWithDateDiff = { ...uniquePost, dateDifferent: dateDiff };
    }

    if (!uniquePostWithDateDiff) {
      return NextResponse.json(
        { message: "Post is not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(uniquePostWithDateDiff, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch the specific post. Please try again later" },
      { status: 500 }
    );
  }
};
