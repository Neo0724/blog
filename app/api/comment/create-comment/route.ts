import { getDateDifference } from "@/app/_util/getDateDifference";
import { CommentSchema } from "@/zod_schema/schema";
import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";
import { checkToken } from "../../jwt/checkToken";

export const POST = checkToken(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const validation = CommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error, {
        status: 500,
      });
    }

    const prisma = prismaClient as PrismaClient;

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

    const returnedComment = await prisma.comment.create({
      data: newComment,
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

    const returnedCommentWithDateDifferent = {
      ...returnedComment,
      dateDifferent: getDateDifference(returnedComment.createdAt),
    };

    return NextResponse.json(
      { newComment: returnedCommentWithDateDifferent },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error occured" },
      { status: 500 }
    );
  }
});
