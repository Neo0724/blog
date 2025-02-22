import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const POST = async (request: NextRequest) => {
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
};
