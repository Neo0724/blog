import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const CommentSchema = z.object({
  content: z.string().min(1).max(200),
  user_id: z.string(),
  post_id: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = CommentSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error, {
      status: 400,
    });
  }

  const prisma = new PrismaClient();

  const comment = await prisma.comment.create({
    data: {
      content: body.content,
      user_id: body.user_id,
      post_id: body.post_id,
    },
  });

  const returnComment = await prisma.comment.findFirst({
    where: {
      comment_id: comment.comment_id,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(returnComment, { status: 200 });
}
