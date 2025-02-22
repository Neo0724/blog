import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt-ts";

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const body = await request.json();

    const userExist = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!userExist) {
      return NextResponse.json(
        { error: "Email does not exists" },
        { status: 404 }
      );
    } else {
      const correctPassword = await compareSync(
        body.password,
        userExist.password
      );

      if (correctPassword) {
        return NextResponse.json(
          { username: userExist.name, user_id: userExist.user_id },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Password is incorrect" },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sign in user" },
      { status: 500 }
    );
  }
}
