"use client";
import Link from "next/link";
import React, { useState } from "react";
import { GrBlog } from "react-icons/gr";
import { FaArrowRight } from "react-icons/fa6";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api/helpers/baseApi";
import queryClient from "@/schemas/queryClient";
import toast from "react-hot-toast";
const Navbar = () => {
  const [pop, setPop] = useState(true);
  const getWhoAmI = async (): Promise<{
    success: boolean;
    userData: { name: string; isLoggin: true };
  }> => {
    const response = await api.get("/user/whoami");
    const data = response.data;
    return data;
  };
  const { data } = useQuery({
    queryKey: ["whoami"],
    queryFn: getWhoAmI,
  });
  const LogoutUser = async () => {
    const response = await api.post("/user/logout");
    const data: { success: boolean; message: string } = await response.data;
    if (data.success) {
      toast.success(data.message);
    }
  };
  const { mutateAsync: LogUser } = useMutation({
    mutationFn: LogoutUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["whoami"] });
    },
  });

  return (
    <div className="w-full shadow-xl">
      <div className="w-[95%] mx-auto flex justify-between items-center py-3">
        <Link href={"/"} className="flex items-center gap-2">
          <GrBlog className="text-3xl font-bold text-white" />
          <h3 className="text-3xl font-semibold text-white">Blogger</h3>
        </Link>

        {data?.success === true ? (
          <div className="relative w-fit bg-white/10 backdrop-blur-md text-white rounded-xl shadow-xl overflow-hidden ">
            {/* User Info Header */}
            <div
              className="flex items-center gap-4 p-4 border-b border-white/20 cursor-pointer"
              onClick={() => setPop(!pop)}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                {data.userData.name[0].toUpperCase()}
              </div>
              <p className="text-lg font-semibold">{data.userData.name}</p>
            </div>

            {/* Dropdown Content */}
            <div
              className={`p-4 hover:bg-white/20 cursor-pointer transition-colors rounded-b-xl ${
                pop ? "hidden" : "block"
              }`}
            >
              <h1 className="text-base font-medium mb-1">
                {data.userData.name}
              </h1>
              <h3
                className="text-sm text-red-300 font-semibold hover:underline"
                onClick={() => LogUser()}
              >
                Logout
              </h3>
            </div>
          </div>
        ) : (
          <Link
            href="/pages/login"
            className="flex items-center px-4 py-2 border border-slate-300 rounded-full transition-all duration-300 ease-linear hover:gap-3"
          >
            <h1 className="text-white text-2xl font-semibold">Login</h1>
            <FaArrowRight className="font-bold text-2xl text-white" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
