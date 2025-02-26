import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { SignUpSchema } from "@/zod_schema/schema";

export async function POST(request: NextRequest) {
  const prisma = prismaClient as PrismaClient;

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

  try {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      },
      select: {
        name: true,
      },
    });

    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error signing up user " },
      { status: 500 }
    );
  }
}
