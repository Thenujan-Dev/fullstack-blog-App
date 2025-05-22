import Link from "next/link";
import React from "react";
import { GrBlog } from "react-icons/gr";
import { FaArrowRight } from "react-icons/fa6";
const Navbar = () => {
  return (
    <div className="w-full shadow-xl">
      <div className="w-[95%] mx-auto flex justify-between items-center py-3">
        <Link href={"/"} className="flex items-center gap-2">
          <GrBlog className="text-3xl font-bold text-white" />
          <h3 className="text-3xl font-semibold text-white">Blogger</h3>
        </Link>
        <Link
          href="/pages/login"
          className="flex items-center px-4 py-2 border border-slate-300 rounded-full transition-all duration-300 ease-linear hover:gap-3"
        >
          <h1 className="text-white text-2xl font-semibold">Login</h1>
          <FaArrowRight className="font-bold text-2xl text-white" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
