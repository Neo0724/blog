import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prismaClient from "../../getPrismaClient";
import { checkToken } from "../../jwt/checkToken";

const ReplyCommentSchema = z.object({
  content: z.string().min(1).max(65535),
  user_id: z.string(),
  target_user_id: z.string(),
  comment_id: z.string(),
  comment_reply_id: z.string().optional(),
});

export const POST = checkToken(async (request: NextRequest) => {
  try {
    const body: z.infer<typeof ReplyCommentSchema> = await request.json();

    const validation = ReplyCommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error, {
        status: 500,
      });
    }

    const prisma = prismaClient as PrismaClient;

    const newCommentReply: Prisma.CommentReplyCreateInput = {
      content: body.content,

      User: {
        connect: {
          user_id: body.user_id,
        },
      },

      Comment: {
        connect: {
          comment_id: body.comment_id,
        },
      },

      Target_user: {
        connect: {
          user_id: body.target_user_id,
        },
      },
    };

    const returnedCommentReply = await prisma.commentReply.create({
      data: newCommentReply,
      select: {
        comment_reply_id: true,
        content: true,
        User: {
          select: {
            name: true,
            user_id: true,
          },
        },
        Target_user: {
          select: {
            name: true,
            user_id: true,
          },
        },
      },
    });

    return NextResponse.json(
      { newCommentReply: returnedCommentReply },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error occured" },
      { status: 500 }
    );
  }
})
