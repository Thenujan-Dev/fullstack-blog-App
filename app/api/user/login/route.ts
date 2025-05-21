import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import prisma from "@/lib/prisma";
import { UserLoginSchema } from "@/schemas/user.schema";
import { verify as VerifyPassword } from "argon2";

import { generateToken } from "../../helpers/generateToken";
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = UserLoginSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Credentials",
        },
        { status: 400 }
      );
    }
    const checkPassword = await VerifyPassword(
      user.password,
      validatedData.password
    );
    if (!checkPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Credentials",
        },
        { status: 400 }
      );
    }
    const token = generateToken({ id: user.id });
    return NextResponse.json(
      {
        success: true,
        message: "User logged in successfully!",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError({ error, defaultError: "Failed to Login User" });
  }
};
