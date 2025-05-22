import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import { UserRegisterSchema } from "@/schemas/user.schema";
import prisma from "@/lib/prisma";
import { hash } from "argon2";
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = UserRegisterSchema.parse(body);
    const isEmailExist = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (isEmailExist) {
      return NextResponse.json(
        {
          success: false,
          message: "user with its Email id Already Exist",
        },
        { status: 409 }
      );
    }
    const hashedPassword = await hash(validatedData.password);
    const hashedConfirmPassword = await hash(validatedData.confirmPassword);
    const newUser = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
      },
    });
    return NextResponse.json({
      success: true,
      message: "User Registered successfully",
      newUser,
    });
  } catch (error) {
    return handleError({ error, defaultError: "Failed to Register User" });
  }
};
