import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt-ts";
import prismaClient from "../../getPrismaClient";
import jwt from "jsonwebtoken";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  const prisma = prismaClient as PrismaClient;

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

      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

      const refresh_secret = new TextEncoder().encode(
        process.env.JWT_REFRESH_KEY
      );

      if (correctPassword) {
        const access_token = await new SignJWT({ user_id: userExist.user_id })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("15m")
          .sign(secret);

        const refresh_token = await new SignJWT({ user_id: userExist.user_id })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("150d")
          .sign(refresh_secret);

        const res = NextResponse.json(
          {
            username: userExist.name,
            user_id: userExist.user_id,
          },
          { status: 200 }
        );

        res.cookies.set("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 15,
          path: "/",
        });

        res.cookies.set("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 150,
          path: "/",
        });

        return res;
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
