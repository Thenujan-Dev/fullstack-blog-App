import { NextResponse } from "next/server";
import { z } from "zod";

export const handleError = ({
  error,
  defaultError,
}: {
  error: any;
  defaultError: string;
}) => {
  console.log(error);
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "validation failed",
        error: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {
      success: false,
      message: "Internal server Error" + defaultError,
    },
    { status: 500 }
  );
};
