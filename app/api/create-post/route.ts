import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const POST = async (request: NextRequest) => {
  
  const body = await request.json();
  const validation = await CreatePostSchema.safeParse(body);
  
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
      user_id: body.user_id,
    },
  });
  return NextResponse.json({ message: "Success", data: newPost }, { status: 200 });
};
