import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const targetId = request.nextUrl.searchParams.get("target_id");
  const queryUsername = request.nextUrl.searchParams.get("query_username");

  const prisma = new PrismaClient();

  try {
    const allFollower = await prisma.follower.findMany({
      where: {
        // Fetch all user that follows the targetId
        User_following_id: targetId as string,
        UserOwner: {
          name: {
            contains: queryUsername as string,
          },
        },
      },
      select: {
        UserOwner: {
          select: {
            name: true,
            user_id: true,
          },
        },
        createdAt: true,
      },
    });

    const fieldRenamedAllFollower = allFollower.map((follower) => {
      return {
        UserFollower: follower.UserOwner,
        createdAt: follower.createdAt,
      };
    });
    /* 
    Example return type:
    [
      {
          "UserFollower": {
              "name": "Tashi",
              "user_id": "30734b45-e49c-4c6f-97fe-0e5e56097471"
          },
          "createdAt": "2025-01-08T07:43:59.373Z"
      }
    ] 
    */

    return NextResponse.json(fieldRenamedAllFollower ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 }
    );
  }
}
