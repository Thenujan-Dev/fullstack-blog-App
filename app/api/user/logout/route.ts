import prisma from "@/lib/prisma";
import { handleError } from "../../helpers/handleError";
import privateRoute from "../../helpers/privateRoute";
import { NextResponse } from "next/server";
import { CookieKeys } from "@/config/CookieKeys";

export const POST = async () => {
  try {
    return await privateRoute(async (usr) => {
      const userId = usr.id;
      const userData = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userData) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 }
        );
      }

      const Response = NextResponse.json(
        {
          success: true,
          message: "user Logout successfully",
        },
        { status: 200 }
      );
      Response.cookies.set(CookieKeys.COOKIE_KEY, "", {
        httpOnly: true,
        maxAge: 0,
      });
      return Response;
    });
  } catch (error) {
    return handleError({ error, defaultError: "Failed to logout user" });
  }
};
