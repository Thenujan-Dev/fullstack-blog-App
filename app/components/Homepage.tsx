"use client";
import React, { useState } from "react";
import Navbar from "./Navbar";
import BlogText from "./BlogText";
import { useQuery } from "@tanstack/react-query";
import { Blog } from "../generated/prisma";
import api from "../api/helpers/baseApi";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";

type cat = "All" | "webdevelopment" | "webdesign" | "cybersecurity";

type blogResponse = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: "webdevelopment" | "webdesign" | "cybersecurity" | "all";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  Author: {
    fullName: string;
  };
};

const categories: cat[] = [
  "All",
  "webdevelopment",
  "webdesign",
  "cybersecurity",
];

const Homepage = () => {
  const [bg, setBg] = useState<cat>("All");

  const GetAllBlogs = async (): Promise<{
    success: boolean;
    data: { allBlogs: blogResponse[] };
  }> => {
    const response = await api.get("/blog");
    return response.data;
  };

  const { isLoading, data: blogs } = useQuery({
    queryKey: ["get-blogs"],
    queryFn: GetAllBlogs,
  });

  const filteredBlogs =
    bg === "All"
      ? blogs?.data.allBlogs || []
      : blogs?.data.allBlogs.filter((blog) => blog.category === bg) || [];

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-blue-400 to-indigo-800 pb-10">
      <Navbar />
      <BlogText />

      {/* Category Tabs */}
      <nav className="w-[80%] mx-auto mt-6 flex justify-between rounded-xl overflow-hidden bg-indigo-700">
        {categories.map((category) => (
          <li
            key={category}
            className={`list-none capitalize font-semibold text-white text-sm cursor-pointer px-4 py-3 w-full text-center transition-all duration-200 ${
              bg === category ? "bg-black shadow-md" : "hover:bg-indigo-600"
            }`}
            onClick={() => setBg(category)}
          >
            {category}
          </li>
        ))}
      </nav>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="w-full h-[40vh] flex items-center justify-center">
          <CircularProgress size={60} />
        </div>
      )}

      {/* Blog Cards */}
      {!isLoading && blogs?.success && (
        <div className="w-[90%] mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBlogs.map((blg) => (
            <div
              key={blg.id}
              className="border border-purple-700 bg-white/10 backdrop-blur-sm text-white p-5 rounded-xl shadow-lg flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform"
            >
              <h1 className="text-xl font-bold text-center">{blg.title}</h1>
              <h3 className="text-md w-fit text-white bg-black px-2 py-1 rounded">
                {blg.category}
              </h3>
              <h2 className="text-sm font-semibold">
                Author:{" "}
                <span className="text-orange-400">{blg.Author.fullName}</span>
              </h2>
              <p className="text-sm line-clamp-4">{blg.content}</p>
              <div className="flex justify-between mt-2">
                <Button variant="contained" size="small" color="error">
                  Delete
                </Button>
                <Button variant="contained" size="small" color="primary">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Blogs Message */}
      {!isLoading && blogs?.success && filteredBlogs.length === 0 && (
        <div className="text-center text-white text-lg mt-20">
          No blogs found in <span className="font-semibold">{bg}</span>{" "}
          category.
        </div>
      )}
    </div>
  );
};

export default Homepage;
