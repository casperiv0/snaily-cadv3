import jwt from "jsonwebtoken";
import config from "../lib/config";

function useToken(user: { id: string }): string {
  return jwt.sign(user, config.jwtSecret, { expiresIn: 3600 });
}

export default useToken;
