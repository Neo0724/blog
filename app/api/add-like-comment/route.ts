import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json()

  const prisma = new PrismaClient();
  try {
    const likedComment: Prisma.LikedCommentCreateInput = {
      Comment: {
        connect: {
          comment_id: body.comment_id as string,
        },
      },
      User: {
        connect: {
          user_id: body.user_id as string,
        },
      },
    };

    const [ returnedLikedComment, totalLikedCommentCount ] = await prisma.$transaction([
        prisma.likedComment.create({ data: likedComment }),
        prisma.likedComment.count({
            where: {
                Comment_comment_id: body.comment_id as string
            }
        })
    ]);

    return NextResponse.json({totalLikedCount: totalLikedCommentCount}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 }
    );
  }
}
