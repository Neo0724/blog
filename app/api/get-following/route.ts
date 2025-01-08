import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ownerId = request.nextUrl.searchParams.get("owner_id");

  const prisma = new PrismaClient();

  try {
    const allFollowings = await prisma.follower.findMany({
      where: {
        User_owner_id: ownerId as string,
      },
      select: {
        UserFollowing: {
          select: {
            name: true,
            user_id: true,
          },
        },
        createdAt: true,
      },
    });

    /* 
    Example return type:
    [
      {
          "UserFollowing": {
              "name": "Alan",
              "user_id": "3b043e4d-3d8d-414d-8dd8-b2ce0be44c25"
          },
          "createdAt": "2025-01-08T07:43:59.373Z"
      }
    ] 
    
    */

    return NextResponse.json(allFollowings ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 }
    );
  }
}
