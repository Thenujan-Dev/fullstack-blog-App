import jwt from "jsonwebtoken";
export const verifyToken = ({ token }: { token: string }) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    const err = error as any;
    console.log("ERRORNAME:" + err.name);

    if (err.name === "JsonWebTokenError")
      throw {
        code: "invalid-token",
        message: "token that you have provided is invalid",
      };
    if (err.name === "TokenExpiredError")
      throw {
        code: "invalid-Expired",
        message: "token that you have provided has been expired",
      };
  }
};
