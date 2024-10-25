import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  user_id: z.string(),
});

export const CreatePostFormSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const POST = async (request: NextRequest) => {
  try {
    const body: z.infer<typeof CreatePostSchema> = await request.json();
    const validation = CreatePostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.issues[0].message, {
        status: 400,
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
    });
    return NextResponse.json(
      { message: "Success", data: newPost },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error occured" },
      { status: 400 },
    );
  }
};
