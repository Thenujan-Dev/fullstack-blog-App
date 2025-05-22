import { CookieKeys } from "@/config/CookieKeys";
import axios from "axios";
import Cookie from "js-cookie";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  responseType: "json",
});

api.interceptors.request.use(
  (config) => {
    const token = Cookie.get(CookieKeys.COOKIE_KEY) ?? "";
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
