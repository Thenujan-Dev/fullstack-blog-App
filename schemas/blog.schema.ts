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

export { BlogSchema };
