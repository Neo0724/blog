import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

export const SignUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();

  const body = await request.json();
  const validation = SignUpSchema.safeParse(body);

  const userExisted = await prisma.user.findFirst({
    where: {
      name: body.name,
      email: body.email,
    },
  });

  if (userExisted) {
    return NextResponse.json({ error: "User Existed" }, { status: 500 });
  }

  if (!validation.success) {
    return NextResponse.json(validation.error.issues[0].message, {
      status: 500,
    });
  }

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: body.password,
    },
  });

  return NextResponse.json(user);
}
