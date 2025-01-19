import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { targetUserId, fromUserId, type, resourceId } = await req.json();

  const prisma = new PrismaClient();

  try {
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
      { status: 400 }
    );
  }
}
