import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { checkToken } from "../../jwt/checkToken";

export const DELETE = checkToken(async (request: NextRequest) => {
  // The owner that want to remove the follower
  const ownerId = request.nextUrl.searchParams.get("owner_id");
  // The user that the owner wanted to remove
  const followerId = request.nextUrl.searchParams.get("follower_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const deletedFollower = await prisma.follower.delete({
      where: {
        // Owner_id has to be the folllowerId because the followerId is the person who followed the owner initially
        User_owner_id_User_following_id: {
          User_following_id: ownerId as string,
          User_owner_id: followerId as string,
        },
      },
    });

    return NextResponse.json(deletedFollower, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
})
