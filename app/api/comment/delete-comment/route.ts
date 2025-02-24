import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function DELETE(request: NextRequest) {
  const comment_id = request.nextUrl.searchParams.get("comment_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        comment_id: comment_id as string,
      },
      select: {
        comment_id: true,
        content: true,
        createdAt: true,
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ deletedComment }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
