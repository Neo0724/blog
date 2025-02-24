import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function POST(req: NextRequest) {
  const { targetUserId, fromUserId, type, resourceId } = await req.json();

  const prisma = prismaClient as PrismaClient;

  try {
    // Check for duplicate notification
    const duplicateNotification = await prisma.notification.findFirst({
      where: {
        resourceId: resourceId,
        type: type,
        FromUserId: fromUserId,
        TargetUserId: targetUserId,
      },
    });

    // Return early to avoid creating duplicate notification
    if (duplicateNotification)
      return NextResponse.json(duplicateNotification, { status: 200 });

    const newNotification = await prisma.notification.create({
      data: {
        resourceId: resourceId,
        type: type,

        FromUser: {
          connect: {
            user_id: fromUserId,
          },
        },
        TargetUser: {
          connect: {
            user_id: targetUserId,
          },
        },
      },
    });

    return NextResponse.json(newNotification, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
