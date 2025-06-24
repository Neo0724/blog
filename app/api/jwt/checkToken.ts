import { jwtVerify, SignJWT } from "jose";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const checkToken = (handler: (request: NextRequest) => Promise<any>) => {
  return async function (request: NextRequest) {
    try {
      const refresh_token = request.cookies.get("refresh_token")?.value;

      if (!refresh_token) {
        return NextResponse.json(
          { error: "Refresh token not found" },
          { status: 401 }
        );
      }

      const secret = new TextEncoder().encode(process.env.JWT_REFRESH_KEY);

      const { payload } = (await jwtVerify(
        refresh_token,
        secret
      )) as JwtPayload;

      const new_access_token = await new SignJWT({ user_id: payload.user_id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("15m")
        .sign(secret);

      const response: NextResponse = await handler(request);

      response.cookies.set("access_token", new_access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 15,
        path: "/",
      });

      return response;
    } catch (error) {
      console.log("Error regenerating refresh token: " + error);
      return NextResponse.json(
        { error: "Refresh token is either invalid or expired" },
        { status: 401 }
      );
    }
  };
};
