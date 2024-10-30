import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();
  const searchText = req.nextUrl.searchParams.get("searchText");

  try {
    const allPosts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: searchText as string } },
          { content: { contains: searchText as string } },
          { User: { name: { contains: searchText as string } } },
        ],
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

    return NextResponse.json(allPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 400 });
  }
};
