"use client";
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import BlogText from "./BlogText";
import { useQuery } from "@tanstack/react-query";
import { IoMdAddCircleOutline } from "react-icons/io";
import api from "../api/helpers/baseApi";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

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
  const [searchInput, setSearchInput] = useState("");
  const [searchDebounced, setSearchDebounced] = useState(searchInput);
  const [pageNumber, setPageNumber] = useState(1);
  const [size, setSize] = useState(25);
  const [bg, setBg] = useState<cat>("All");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const options = useMemo(() => {
    return {
      search: searchDebounced,
      page: pageNumber,
      size,
    };
  }, [searchDebounced, pageNumber, size]);

  const GetAllBlogs = async (): Promise<{
    success: boolean;
    data: {
      allBlogs: blogResponse[];
      pagination: {
        total: number;
        page: number;
        size: number;
        totalPages: number;
      };
    };
  }> => {
    const response = await api.get("/blog", { params: options });
    return response.data;
  };

  const { isLoading, data: blogs } = useQuery({
    queryKey: ["get-blogs", options],
    queryFn: GetAllBlogs,
  });

  const filteredBlogs =
    bg === "All"
      ? blogs?.data.allBlogs || []
      : blogs?.data.allBlogs.filter((blog) => blog.category === bg) || [];

  const DecreasePage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const IncreasePage = () => {
    const totalPages = blogs?.data.pagination.totalPages;
    if (pageNumber < (totalPages || 1)) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-blue-500 to-indigo-900 pb-20">
      <Navbar />
      <BlogText />

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-[90%] sm:w-[60%] mx-auto mt-6 gap-4">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Search Blog..."
          className="w-full sm:w-[75%] px-4 py-2 rounded-md border border-white focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 text-white placeholder-white/70 transition-all"
        />
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md transition-all">
          <IoMdAddCircleOutline className="text-white text-lg" />
          Add
        </button>
      </div>

      {/* Category Tabs */}
      <nav className="w-[90%] sm:w-[80%] mx-auto mt-8 flex flex-wrap justify-center sm:justify-between gap-3 bg-indigo-700 rounded-xl p-3 shadow-md">
        {categories.map((category) => (
          <li
            key={category}
            className={`list-none capitalize font-medium text-white text-sm cursor-pointer px-5 py-2 rounded-lg text-center transition-all duration-200 ${
              bg === category ? "bg-black shadow-lg" : "hover:bg-indigo-600"
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
        <div className="w-[90%] mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBlogs.map((blg) => (
            <div
              key={blg.id}
              className="border border-purple-700 bg-white/10 backdrop-blur-lg text-white p-6 rounded-2xl shadow-lg flex flex-col gap-4 hover:scale-[1.02] hover:shadow-2xl transition-transform duration-200"
            >
              <h1 className="text-xl font-bold text-center">{blg.title}</h1>
              <h3 className="text-xs w-fit bg-black px-3 py-1 rounded-full uppercase tracking-wide">
                {blg.category}
              </h3>
              <h2 className="text-sm font-semibold">
                Author:{" "}
                <span className="text-orange-400">{blg.Author.fullName}</span>
              </h2>
              <p className="text-sm line-clamp-4 text-white/90">
                {blg.content}
              </p>
              <div className="flex justify-between mt-4">
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
          No blogs found in{" "}
          <span className="font-semibold capitalize">{bg}</span> category.
        </div>
      )}

      {/* Pagination Controls */}
      <div className="w-[90%] sm:w-[80%] flex flex-col sm:flex-row justify-between items-center mt-10 mx-auto gap-6">
        <select
          className="border border-indigo-900 rounded-xl bg-indigo-600 text-white px-4 py-2 shadow-md"
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPageNumber(1); // reset to first page
          }}
          value={size}
        >
          {[4, 10, 25, 50].map((num) => (
            <option key={num} value={num}>
              {num} / page
            </option>
          ))}
        </select>

        <div className="flex items-center gap-4 bg-blue-500 px-4 py-2 rounded-xl shadow-md">
          <FaAngleLeft
            className={`text-2xl text-white cursor-pointer ${
              pageNumber === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={DecreasePage}
          />
          <button className="bg-indigo-800 text-white px-4 py-2 rounded-md font-semibold">
            Page {pageNumber}
          </button>
          <FaAngleRight
            className={`text-2xl text-white cursor-pointer ${
              pageNumber === blogs?.data.pagination.totalPages
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={IncreasePage}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
