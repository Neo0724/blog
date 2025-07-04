import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { checkToken } from "../../jwt/checkToken";

export const POST = checkToken(async (request: NextRequest) => {
  const { ownerId, targetId } = await request.json();

  const prisma = prismaClient as PrismaClient;

  try {
    const newFollowing: Prisma.FollowerCreateInput = {
      UserOwner: {
        connect: {
          user_id: ownerId,
        },
      },
      UserFollowing: {
        connect: {
          user_id: targetId,
        },
      },
    };

    const returnedFollowing = await prisma.follower.create({
      data: newFollowing,
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

    return NextResponse.json(
      { newFollowing: returnedFollowing },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
})
