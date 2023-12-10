import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const post_id = request.nextUrl.searchParams.get("post_id");

  const prisma = new PrismaClient();

  try {
    const comments = await prisma.comment.findMany({
      where: {
        post_id: post_id ?? "",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 }
    );
  }
}
