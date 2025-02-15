import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { notification_id } = await request.json();

  const prisma = new PrismaClient();

  try {
    const updatedNotification = await prisma.notification.update({
      where: {
        notification_id: notification_id,
      },
      data: {
        hasViewed: true,
      },
    });

    return NextResponse.json({ ...updatedNotification }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
