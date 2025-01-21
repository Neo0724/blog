import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const POST = async (request: NextRequest) => {
  const prisma = new PrismaClient();

  const body = await request.json();

  const userExist = await prisma.user.findFirst({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (userExist) {
    return NextResponse.json(
      { username: userExist.name, user_id: userExist.user_id },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { error: "Invalid email or password" },
    { status: 400 },
  );
};
