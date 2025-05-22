"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { UserLoginSchema } from "@/schemas/user.schema";
import api from "../api/helpers/baseApi";
import Cookie from "js-cookie";
import { CookieKeys } from "@/config/CookieKeys";

const textFieldStyles = {
  "& label": {
    color: "white",
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "#c7d2fe",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#a5b4fc",
    },
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDesabled] = useState(true);
  const router = useRouter();
  type userLoginResponseType = z.infer<typeof UserLoginSchema>;
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<userLoginResponseType>({
    mode: "onTouched",
    resolver: zodResolver(UserLoginSchema),
  });
  const LoginUser = async (UserData: { email: string; password: string }) => {
    const response = await api.post("/user/login", UserData);
    const data: { success: boolean; message: string; token: string } =
      await response.data;
    if (data.success) {
      toast.success(data.message);
      reset();
      Cookie.set(CookieKeys.COOKIE_KEY, data.token);
      router.push("/");
    }

    return data;
  };
  const { mutateAsync: LogUser, isPending } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: LoginUser,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
  useEffect(() => {
    if (!email || !password) {
      setDesabled(true);
    } else {
      setDesabled(false);
    }
  }, [email, password]);

  return (
    <div className="h-dvh w-full bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 flex flex-col md:flex-row gap-10 p-8 md:p-12 items-center">
        {/* Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            className="w-full h-auto object-contain"
            src="/login.png"
            alt="login"
            width={500}
            height={500}
          />
        </div>

        {/* Login Form */}
        <form
          className="w-full md:w-1/2 flex flex-col gap-6"
          onSubmit={handleSubmit(async (FormData) => {
            await LogUser(FormData);
          })}
        >
          <h1 className="text-4xl font-extrabold text-white text-center mb-2 drop-shadow-md">
            User{" "}
            <span className="text-indigo-300">
              {isPending ? "Processing..." : "Login"}
            </span>
          </h1>

          <TextField
            size="small"
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            sx={textFieldStyles}
            {...register("email")}
            helperText={errors.email?.message}
            error={!!errors.email?.message}
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
          <TextField
            size="small"
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            sx={textFieldStyles}
            {...register("password")}
            helperText={errors.password?.message}
            error={!!errors.password?.message}
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
          />

          <Link
            href="/pages/register"
            className="text-sm text-blue-200 hover:text-white hover:underline transition"
          >
            Don't have an account? Register here
          </Link>

          <Button
            fullWidth
            size="large"
            type="submit"
            disabled={disabled}
            variant="contained"
            sx={{
              backgroundColor: "#4f46e5",
              fontWeight: "bold",
              paddingY: "0.75rem",
              fontSize: "1rem",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#4338ca",
              },
            }}
          >
            {isPending ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
