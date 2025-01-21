import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const prisma = new PrismaClient();
  const commentId = req.nextUrl.searchParams.get("comment_id");

  try {
    const postWithSpecificCommentId = await prisma.post.findFirst({
      where: {
        being_commented_post: {
          some: {
            comment_id: commentId as string,
          },
        },
      },
      select: {
        post_id: true,
      },
    });

    if (!postWithSpecificCommentId) {
      return NextResponse.json(
        { message: "Could not found the post with the given comment id" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { postId: postWithSpecificCommentId.post_id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search the post. Please try again later" },
      { status: 500 }
    );
  }
};
