import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");

  const prisma = new PrismaClient();

  try {
    const allNotification = await prisma.notification.findMany({
      where: {
        TargetUser: {
          user_id: user_id as string,
        },
      },
    });

    return NextResponse.json(allNotification ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occur!" },
      { status: 400 }
    );
  }
}
