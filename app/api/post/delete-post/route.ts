import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";
import { checkToken } from "../../jwt/checkToken";

export const DELETE = checkToken(async (request: NextRequest) => {
  const post_id = request.nextUrl.searchParams.get("post_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const deletedPost = await prisma.post.delete({
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

    return NextResponse.json({ deletedPost: deletedPost }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
});
