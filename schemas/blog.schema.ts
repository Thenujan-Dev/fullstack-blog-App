import { z } from "zod";
const BlogSchema = z.object({
  title: z
    .string({ required_error: "Title is required!" })
    .min(3, { message: "Title must be at least 3 characters long" }),

  content: z.string({ required_error: "Content is required" }),

  slug: z
    .string({ required_error: "Slug is required!" })
    .min(3, { message: "Slug must be at least 3 characters long" }),
});
const PaginationSchema = z.object({
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

export { BlogSchema, PaginationSchema };
