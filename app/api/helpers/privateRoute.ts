import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
export default async function privateRoute(
  cb: (user: { id: string }) => Promise<NextResponse>
) {
  try {
    const authorization = (await headers()).get("Authorization");
    const token = authorization?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          code: "user-not-authorized",
          message: "You are not authorized",
        },
        { status: 401 }
      );
    }
    jwt.verify(token, process?.env?.JWT_SECRET!);
    const decodedToken = jwt.decode(token) as JwtPayload & { id: string };

    return cb(decodedToken);
  } catch (error) {
    const err = error as any;
    console.log({ name: err.name });
    if (err.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          code: "invalid-token",
          message: "The token you provide is not valid.",
        },
        { status: 401 }
      );
    }
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          code: "token-expired",
          message: "The token you provide has been expired.",
        },
        { status: 401 }
      );
    }
  }
}
