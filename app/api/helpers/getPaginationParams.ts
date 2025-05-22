import { NextRequest } from "next/server";
import { z } from "zod";

const DefaultSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "1", 10))
    .refine((val) => !isNaN(val), { message: "page must be a number" })
    .refine((val) => val > 0, { message: "page must be greater than 0" }),
  size: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "25", 10))
    .refine((val) => !isNaN(val), { message: "size must be a number" })
    .refine((val) => val > 0, { message: "size must be greater than 0" }),
});
type ReturnType = {
  page: number;
  size: number;
};

export const getPaginationParams = ({
  req,
  schema,
  pageKey = "page",
  sizeKey = "size",
}: {
  req: NextRequest;
  schema?: any;
  pageKey?: string;
  sizeKey?: string;
}): ReturnType => {
  const paginationRow = {
    page: req.nextUrl.searchParams.get(pageKey) ?? "1",
    size: req.nextUrl.searchParams.get(sizeKey) ?? "25",
  };

  const schematobeUsed = schema ?? DefaultSchema;
  const { page, size } = schematobeUsed.parse(paginationRow);
  return { page, size };
};
