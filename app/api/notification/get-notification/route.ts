import { NotificationType, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function fetchPostIdByCommentId(
  commentId: string
): Promise<string | null> {
  let postId: string | null = null;

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

    if (postWithSpecificCommentId) {
      postId = postWithSpecificCommentId.post_id;
    }
  } catch (error) {
    console.log(error);
  } finally {
    return postId;
  }
}
async function fetchPostIdAndCommentIdByCommentReplyId(
  commentReplyId: string
): Promise<{
  postId: string | null;
  commentId: string | null;
}> {
  let postIdAndCommentId: {
    postId: string | null;
    commentId: string | null;
  } = { postId: null, commentId: null };
  try {
    const replyComments = await prisma.commentReply.findUnique({
      where: {
        comment_reply_id: commentReplyId as string,
      },
      select: {
        Comment: {
          select: {
            comment_id: true,
            Post: {
              select: {
                post_id: true,
              },
            },
          },
        },
      },
    });

    if (replyComments) {
      postIdAndCommentId = {
        postId: replyComments.Comment.Post.post_id,
        commentId: replyComments.Comment.comment_id,
      };
    }
  } catch (error) {
    console.log(error);
  } finally {
    return postIdAndCommentId;
  }
}

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");

  try {
    const allNotification = await prisma.notification.findMany({
      where: {
        TargetUser: {
          user_id: user_id as string,
        },
      },
      select: {
        TargetUser: {
          select: {
            name: true,
            user_id: true,
          },
        },
        FromUser: {
          select: {
            name: true,
            user_id: true,
          },
        },
        notification_id: true,
        type: true,
        resourceId: true,
        hasViewed: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const notificationWithRequiredResource = await Promise.all(
      allNotification.map(async ({ resourceId, ...notification }) => {
        const updatedNotification = {
          ...notification,
          resource: {},
        };
        switch (notification.type) {
          // resourceId will be the follower user id
          case NotificationType.FOLLOW:
            updatedNotification.resource = {
              followerUserId: resourceId,
            };
            break;

          // resourceId will be the post id
          case NotificationType.LIKE_POST:
          case NotificationType.POST:
            updatedNotification.resource = { postId: resourceId };
            break;

          // resourceId will be the comment id
          case NotificationType.LIKE_COMMENT:
          case NotificationType.COMMENT:
            const postId = await fetchPostIdByCommentId(resourceId);
            updatedNotification.resource = {
              postId,
              commentId: resourceId,
            };
            break;

          // resourceId will be the comment reply id
          case NotificationType.COMMENT_REPLY:
          case NotificationType.LIKE_REPLY_COMMENT:
            const result = await fetchPostIdAndCommentIdByCommentReplyId(
              resourceId
            );
            updatedNotification.resource = {
              postId: result.postId,
              commentId: result.commentId,
              commentReplyId: resourceId,
            };
            break;
        }

        return updatedNotification;
      })
    );

    return NextResponse.json(notificationWithRequiredResource ?? [], {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch the notifications. Please try again later" },
      { status: 500 }
    );
  }
}
