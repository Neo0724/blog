import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const CommentSchema = z.object({
  content: z.string().min(1).max(65535),
  user_id: z.string(),
  post_id: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = CommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error, {
        status: 400,
      });
    }

    const prisma = new PrismaClient();

    const newComment: Prisma.CommentCreateInput = {
      content: body.content,
      User: {
        connect: {
          user_id: body.user_id,
        },
      },
      Post: {
        connect: {
          post_id: body.post_id,
        },
      },
    };

    const returnedComment = await prisma.comment.create({ data: newComment });

    return NextResponse.json(returnedComment, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error occured" },
      { status: 400 }
    );
  }
}
