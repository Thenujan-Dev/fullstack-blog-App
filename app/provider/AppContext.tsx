"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Cookie from "js-cookie";
import { CookieKeys } from "@/config/CookieKeys";
type loginType = {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
};
const loginContext = createContext<null | loginType>(null);
const AppContext = ({ children }: { children: ReactNode }) => {
  const loginInitial = Cookie.get(CookieKeys.COOKIE_KEY) ? true : false;
  const [isLogin, setIsLogin] = useState<boolean>(loginInitial);
  return (
    <loginContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </loginContext.Provider>
  );
};
export const useLogContext = () => {
  const context = useContext(loginContext);
  if (!context) {
    throw new Error("must be withing the context Provider");
  }
  return context;
};
export default AppContext;
