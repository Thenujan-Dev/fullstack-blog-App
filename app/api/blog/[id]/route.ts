import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import { BlogSchema } from "@/schemas/blog.schema";
export const GET = async (req: NextRequest) => {
  try {
    const idUrl = req.url;
    const userId = idUrl.split("blog/")[1];
    const singleBlog = await prisma.blog.findUnique({
      where: { id: userId },
      include: { Author: { select: { fullName: true } } },
    });
    return NextResponse.json({
      success: true,
      singleBlog,
    });
  } catch (error) {
    return handleError({ error, defaultError: "Failed to find single blog" });
  }
};
export const DELETE = async (req: NextRequest) => {
  try {
    const idUrl = req.url;
    const userId = idUrl.split("blog/")[1];
    await prisma.blog.delete({ where: { id: userId } });
    return NextResponse.json({
      success: true,
      message: "User Deleted Succesfully!",
    });
  } catch (error) {
    return handleError({ error, defaultError: "Failed delete blog" });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const idUrl = req.url;
    const body = await req.json();
    const validatedData = BlogSchema.parse(body);
    const userId = idUrl.split("blog/")[1];
    await prisma.blog.update({ where: { id: userId }, data: validatedData });
    return NextResponse.json({
      success: true,
      message: "Blog Updated Succesfully!",
    });
  } catch (error) {
    return handleError({ error, defaultError: "Failed Updated blog" });
  }
};
