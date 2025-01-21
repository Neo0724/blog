import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { comment_id, content } = await request.json();

  const prisma = new PrismaClient();

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        comment_id: comment_id as string,
      },
      data: {
        content: content as string,
      },
      select: {
        comment_id: true,
        content: true,
      },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 }
    );
  }
}
