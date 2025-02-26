import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prismaClient from "../../getPrismaClient";

export async function PUT(request: NextRequest) {
  const notificationId = request.nextUrl.searchParams.get("notification_id");

  const prisma = prismaClient as PrismaClient;

  console.log(notificationId);
  try {
    const updatedNotification = await prisma.notification.update({
      where: {
        notification_id: notificationId as string,
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
