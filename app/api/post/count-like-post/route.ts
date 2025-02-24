import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function GET(request: NextRequest) {
  const post_id = request.nextUrl.searchParams.get("post_id");

  const prisma = prismaClient as PrismaClient;

  try {
    const totalLikeCount = await prisma.likedPost.count({
      where: {
        Post_post_id: post_id as string,
      },
    });

    return NextResponse.json(totalLikeCount, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
