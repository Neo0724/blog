import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { ownerId, targetId } = await request.json();

  const prisma = new PrismaClient();

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
    });

    return NextResponse.json(returnedFollowing, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
