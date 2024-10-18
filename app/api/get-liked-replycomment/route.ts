
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  const comment_id = request.nextUrl.searchParams.get("comment_id");

  try {

    const allLikedComment = await prisma.user.findUnique({
      where: {
        user_id: user_id as string,
        LikedCommentReply: {
          some: {
            CommentReply: {
              Comment_comment_id: comment_id as string
            }
          }
        }
      },

      select: {
        LikedCommentReply: {
          select: {
            CommentReply_comment_reply_id: true
          }
        }
      }
    })

    /* 
    [
      {
          "CommentReply_comment_reply_id": "707e91c1-f8e8-4fe5-8d50-b0a6a07468bf"
      }
    ]
    
    Example output, returned output is an array of all liked reply comment id within a post
    */
    console.log(allLikedComment)
    return NextResponse.json(allLikedComment?.LikedCommentReply ?? [], { status: 200 })
  } catch (error) {
      console.log(error)
      return NextResponse.json(
          { error: "An unexpected error occur!" },
          { status: 400 }
      );
  }
}
