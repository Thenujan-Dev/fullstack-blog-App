"use client";
import { Button, TextField, MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import api from "../api/helpers/baseApi";
import { Blog } from "../generated/prisma";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const EditBlog = ({ id }: { id: string }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<
    "all" | "webdevelopment" | "webdesign" | "cybersecurity"
  >("all");
  const [content, setContent] = useState("");

  const router = useRouter();
  const getSingleBlog = async (): Promise<{ singleBlog: Blog }> => {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  };

  const { data: SingleBlog } = useQuery({
    queryKey: ["get-single-blog", id],
    queryFn: getSingleBlog,
  });
  const EditData = {
    title: title,
    content: content,
    slug: slug,
    category: category,
  };

  const EditBlog = async () => {
    const rsponse = await api.put(`/blog/${id}`, EditData);
    const data = (await rsponse.data) as { success: boolean; message: string };
    if (data.success) {
      toast.success(data.message);
      router.push("/");
    }
    return data;
  };
  const { isPending: editSpending, mutateAsync: UpdateBlg } = useMutation({
    mutationKey: ["edit-blog"],
    mutationFn: EditBlog,
    onError: () => {
      toast.error("something Error Occure");
    },
  });

  useEffect(() => {
    if (SingleBlog?.singleBlog) {
      setTitle(SingleBlog.singleBlog.title);
      setSlug(SingleBlog.singleBlog.slug);
      setCategory(SingleBlog.singleBlog.category);
      setContent(SingleBlog.singleBlog.content);
    }
  }, [SingleBlog]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-blue-900 p-4">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 animate-fade-in flex flex-col gap-8">
        <h1 className="text-5xl font-black text-center text-white tracking-tight">
          Edit <span className="text-purple-300">Blog</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 flex justify-center items-center">
            <div className="relative w-full h-64 lg:h-[450px] rounded-xl overflow-hidden shadow-xl border-4 border-white/20">
              <Image
                src="/edit.png"
                alt="Edit Blog"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col gap-5 text-white">
            <TextField
              label="Title"
              size="medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              InputProps={{
                className:
                  "bg-white/20 text-white placeholder-white/70 rounded-md",
              }}
              InputLabelProps={{
                className: "text-white/80",
              }}
            />
            <TextField
              label="Slug"
              size="medium"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              fullWidth
              InputProps={{
                className:
                  "bg-white/20 text-white placeholder-white/70 rounded-md",
              }}
              InputLabelProps={{
                className: "text-white/80",
              }}
            />
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as
                    | "all"
                    | "webdevelopment"
                    | "webdesign"
                    | "cybersecurity"
                )
              }
              fullWidth
              InputProps={{
                className:
                  "bg-white/20 text-white placeholder-white/70 rounded-md",
              }}
              InputLabelProps={{
                className: "text-white/80",
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="webdevelopment">Web Development</MenuItem>
              <MenuItem value="webdesign">Web Design</MenuItem>
              <MenuItem value="cybersecurity">Cybersecurity</MenuItem>
            </TextField>
            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              size="medium"
              fullWidth
              multiline
              rows={6}
              InputProps={{
                className:
                  "bg-white/20 text-white placeholder-white/70 rounded-md",
              }}
              InputLabelProps={{
                className: "text-white/80",
              }}
            />
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                color="success"
                variant="contained"
                className="rounded-xl px-6 py-2 text-lg font-semibold shadow-md hover:scale-105 transition-transform"
                onClick={() => UpdateBlg()}
              >
                {editSpending ? "Updating" : "Update"}
              </Button>
              <Button
                type="button"
                href="/"
                color="error"
                variant="contained"
                className="rounded-xl px-6 py-2 text-lg font-semibold shadow-md hover:scale-105 transition-transform"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
