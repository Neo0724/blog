import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const allPosts = await prisma.post.findMany({});

    return NextResponse.json(allPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 400 });
  }
};
