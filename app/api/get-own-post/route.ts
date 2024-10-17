import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  const user_id = req.nextUrl.searchParams.get("user_id");

  try {
    const userPosts = await prisma.post.findMany({
      where: {
          User_user_id: user_id as string
      },
        
      select: {
          title: true,
          content: true,
          createdAt: true,
          post_id: true,
          User: {
              select: {
                  user_id: true,
                  name: true
              }
          },
      }
    });

    return NextResponse.json(userPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 400 });
  }
};
