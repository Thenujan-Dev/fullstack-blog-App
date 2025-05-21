import prisma from "@/lib/prisma";
import { BlogSchema } from "@/schemas/blog.schema";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../helpers/handleError";
import privateRoute from "../helpers/privateRoute";

export const POST = async (req: NextRequest) => {
  try {
    return await privateRoute(async (usr) => {
      const body = await req.json();
      const validatedData = BlogSchema.parse(body);
      const userId = usr.id;
      const isSlugExist = await prisma.blog.findUnique({
        where: { slug: validatedData.slug },
      });
      if (isSlugExist) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug already Exist",
          },
          { status: 409 }
        );
      }
      const newBlog = await prisma.blog.create({
        data: {
          Author: {
            connect: {
              id: userId,
            },
          },
          ...validatedData,
        },
        include: {
          Author: {
            select: {
              fullName: true,
            },
          },
        },
      });
      return NextResponse.json({
        success: true,
        newBlog,
      });
    });
  } catch (error) {
    return handleError({ error, defaultError: "Failed to create Blog" });
  }
};

export const GET = async (req: NextRequest) => {
  const search = req.nextUrl.searchParams.get("search");

  const searchCondition = search
    ? {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ],
      }
    : {};

  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10);
    const size = parseInt(req.nextUrl.searchParams.get("size") ?? "25", 10);

    const skip = (page - 1) * size;

    const [allBlogs, count] = await prisma.$transaction([
      prisma.blog.findMany({
        where: searchCondition,
        skip,
        take: size,
        orderBy: {
          createdAt: "desc", // optional: newest first
        },
      }),
      prisma.blog.count({
        where: searchCondition,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          blogs: allBlogs,
          pagination: {
            total: count,
            page,
            size,
            totalPages: Math.ceil(count / size),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError({ error, defaultError: "Failed to get all blogs" });
  }
};
