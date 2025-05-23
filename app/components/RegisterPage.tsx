"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import Link from "next/link";
import { z } from "zod";
import { UserRegisterSchema } from "@/schemas/user.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import api from "../api/helpers/baseApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const textFieldStyles = {
  input: { color: "white" },
  label: { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "#c7d2fe" },
    "&.Mui-focused fieldset": { borderColor: "#a5b4fc" },
  },
};

const RegisterPage = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disable, setDesable] = useState(true);
  type userResisterRsposnseType = z.infer<typeof UserRegisterSchema>;
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<userResisterRsposnseType>({
    mode: "onTouched",
    resolver: zodResolver(UserRegisterSchema),
  });
  const RegUser = async (userData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await api.post("/user/register", userData);
      const data: {
        success: boolean;
        message: string;
      } = await response.data;
      if (data.success) {
        toast.success(data.message);
        reset();
        router.push("/pages/login");
      }
      if (!data.success) {
        toast.error(data.message);
      }
      return data;
    } catch (error: any) {
      toast.error("User Already Exists");
    }
  };
  const { mutateAsync: RegiUser, isPending } = useMutation({
    mutationKey: ["register-user"],
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },

    mutationFn: RegUser,
  });
  useEffect(() => {
    if (!fullname || !email || !password || !confirmPassword) {
      setDesable(true);
    } else {
      setDesable(false);
    }
  }, [fullname, email, password, confirmPassword]);
  return (
    <div className="h-dvh w-full bg-gradient-to-br from-blue-700 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 flex flex-col md:flex-row gap-10 p-8 md:p-12 items-center">
        {/* Illustration Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            className="w-full h-auto object-contain"
            src="/register.png"
            alt="register"
            width={500}
            height={500}
          />
        </div>

        {/* Form Section */}
        <form
          className="w-full md:w-1/2 flex flex-col gap-6"
          onSubmit={handleSubmit(async (FormData) => {
            await RegiUser(FormData);
          })}
        >
          <h1 className="text-4xl font-extrabold text-white text-center mb-2 drop-shadow-md">
            {isPending ? (
              "Processing..."
            ) : (
              <>
                User <span className="text-indigo-300">Register</span>
              </>
            )}
          </h1>

          <TextField
            size="small"
            fullWidth
            label="Full Name"
            variant="outlined"
            sx={textFieldStyles}
            InputLabelProps={{ style: { color: "white" } }}
            {...register("fullName")}
            helperText={errors.fullName?.message}
            error={!!errors.fullName?.message}
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            size="small"
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            sx={textFieldStyles}
            InputLabelProps={{ style: { color: "white" } }}
            {...register("email")}
            helperText={errors.email?.message}
            error={!!errors.email?.message}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            size="small"
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            sx={textFieldStyles}
            InputLabelProps={{ style: { color: "white" } }}
            {...register("password")}
            helperText={errors.password?.message}
            error={!!errors.password?.message}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            size="small"
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            sx={textFieldStyles}
            InputLabelProps={{ style: { color: "white" } }}
            {...register("confirmPassword")}
            helperText={errors.confirmPassword?.message}
            error={!!errors.confirmPassword?.message}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Link
            href="/pages/login"
            className="text-sm text-blue-200 hover:text-white hover:underline transition"
          >
            Already have an account? Go to login
          </Link>

          <Button
            fullWidth
            size="large"
            disabled={disable}
            type="submit"
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
            {isPending ? "Processing..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
