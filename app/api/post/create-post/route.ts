import { getDateDifference } from "@/app/_util/getDateDifference";
import { CreatePostSchema } from "@/app/post/_component/custom_hook/usePostHook";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (request: NextRequest) => {
  try {
    const body: z.infer<typeof CreatePostSchema> = await request.json();
    const validation = CreatePostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.issues[0].message, {
        status: 500,
      });
    }

    const prisma = new PrismaClient();

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,

        User: {
          connect: {
            user_id: body.user_id,
          },
        },
      },
      select: {
        title: true,
        content: true,
        createdAt: true,
        post_id: true,
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
    });

    const newPostWithDateDifferent = {
      ...newPost,
      dateDifferent: getDateDifference(newPost.createdAt),
    };

    return NextResponse.json(
      { message: "Success", newPost: newPostWithDateDifferent },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error occured" },
      { status: 500 }
    );
  }
};
