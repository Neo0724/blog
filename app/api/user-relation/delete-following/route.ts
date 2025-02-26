import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const ownerId = request.nextUrl.searchParams.get("owner_id");
  const targetId = request.nextUrl.searchParams.get("target_id");

  const prisma = prismaClient as PrismaClient;
  try {
    const deletedFollowing = await prisma.follower.delete({
      where: {
        User_owner_id_User_following_id: {
          User_following_id: targetId as string,
          User_owner_id: ownerId as string,
        },
      },
      select: {
        UserFollowing: {
          select: {
            name: true,
            user_id: true,
          },
        },
        UserOwner: {
          select: {
            name: true,
            user_id: true,
          },
        },
        createdAt: true,
      },
    });

    return NextResponse.json({ deletedFollowing }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
