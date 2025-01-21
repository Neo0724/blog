import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const prisma = new PrismaClient();

  try {
    const likedPost: Prisma.LikedPostCreateInput = {
      User: {
        connect: {
          user_id: body.user_id as string,
        },
      },

      Post: {
        connect: {
          post_id: body.post_id as string,
        },
      },
    };

    const [returnedLikedPost] = await prisma.$transaction([
      prisma.likedPost.create({ data: likedPost }),
    ]);

    return NextResponse.json({ likedPost: returnedLikedPost }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 },
    );
  }
}
