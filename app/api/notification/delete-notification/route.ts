import { NotificationType, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const targetUserId = request.nextUrl.searchParams.get("target_user_id");
  const fromUserId = request.nextUrl.searchParams.get("from_user_id");
  const resourceId = request.nextUrl.searchParams.get("resource_id");

  const prisma = new PrismaClient();
  try {
    const targetNotification = await prisma.notification.findFirst({
      where: {
        resourceId: resourceId as string,
        TargetUserId: targetUserId as string,
        FromUserId: fromUserId as string,
        type: type as NotificationType,
      },
      select: {
        notification_id: true,
      },
    });

    const deletedNotification = await prisma.notification.delete({
      where: {
        notification_id: targetNotification?.notification_id,
      },
    });

    return NextResponse.json(deletedNotification, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 500 }
    );
  }
}
