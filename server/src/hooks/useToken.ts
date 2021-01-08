import jwt from "jsonwebtoken";

function useToken(user: { id: string }): string {
  const secret = `${process.env.JWT_SECRET}`;
  return jwt.sign(user, secret, { expiresIn: 3600 });
}

export default useToken;
