import { NextRequest, NextResponse } from "next/server";
export async function DELETE(request: NextRequest) {
  try {
    const res = NextResponse.json(
      {
        message: "Successfully removed access and refresh token cookie",
      },
      { status: 200 }
    );

    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");

    return res;
  } catch (error) {
    console.log("Error deleting access and refresh token " + error);
    return NextResponse.json(
      { error: "Error deleting access and refresh token" },
      { status: 500 }
    );
  }
}
