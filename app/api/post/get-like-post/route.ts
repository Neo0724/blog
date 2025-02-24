import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");

  const prisma = prismaClient as PrismaClient;

  try {
    const likedPost = await prisma.likedPost.findMany({
      where: {
        User: {
          user_id: user_id as string,
        },
      },
      select: {
        Post_post_id: true,
      },
    });

    return NextResponse.json(
      likedPost?.map((post) => post.Post_post_id) ?? [],
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
