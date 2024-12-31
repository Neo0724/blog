import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const UpdateReplyCommentSchema = z.object({
  content: z.string().min(1).max(200),
  comment_reply_id: z.string(),
  comment_id: z.string(),
});

export type UpdateReplyCommentType = z.infer<typeof UpdateReplyCommentSchema>;

export async function PUT(request: NextRequest) {
  const replyComment = await request.json();

  const prisma = new PrismaClient();

  try {
    const updatedReplyComment = await prisma.commentReply.update({
      where: {
        comment_reply_id: replyComment.comment_reply_id as string,
      },
      data: {
        content: replyComment.content as string,
      },
      select: {
        comment_reply_id: true,
        content: true,
      },
    });

    return NextResponse.json(updatedReplyComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 }
    );
  }
}
