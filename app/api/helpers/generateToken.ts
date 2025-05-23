import jwt from "jsonwebtoken";
export const generateToken = ({ id }: { id: string }) => {
  try {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET!, {
      expiresIn: "7w",
    });
    return token;
  } catch (error) {
    throw {
      code: "generate_token_err",
      message: "failed to generate Token",
    };
  }
};
