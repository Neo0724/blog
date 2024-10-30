import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const post_id = request.nextUrl.searchParams.get("post_id");

  const prisma = new PrismaClient();
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        post_id: post_id as string,
      },
    });
    return NextResponse.json({ deletedPost: deletedPost }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 },
    );
  }
}
