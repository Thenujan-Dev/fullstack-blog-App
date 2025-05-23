import prisma from "@/lib/prisma";
import privateRoute from "../../helpers/privateRoute";
import { NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";

export const GET = async () => {
  try {
    return await privateRoute(async (usr) => {
      const userId = usr.id;
      if (userId) {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) {
          return NextResponse.json(
            {
              success: false,
              message: "User Not Found",
            },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          userData: {
            name: user.fullName,
            isLoggin: user.isLoggin,
          },
        });
      }
      return NextResponse.json(
        {
          success: false,
          message: "Unothorized User",
        },
        { status: 401 }
      );
    });
  } catch (error) {
    return handleError({ error, defaultError: "Failed to get who am I" });
  }
};
