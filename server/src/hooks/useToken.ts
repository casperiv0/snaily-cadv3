import jwt from "jsonwebtoken";
import config from "../../config";

function useToken(user: any) {
  return jwt.sign(user, config.jwtSecret, { expiresIn: 3600 });
}

export default useToken;
