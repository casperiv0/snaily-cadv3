import { NextApiResponse } from "next";
import { serialize, CookieSerializeOptions } from "cookie";
import { Auth } from "@lib/consts";

export function useCookie(
  res: NextApiResponse,
  token: string,
  name: string = "snaily-cad-session",
  expires: Date = new Date(Date.now() + Auth.CookieExpires),
) {
  const options: CookieSerializeOptions = {
    expires: expires,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
  };

  res.setHeader("Set-Cookie", serialize(name, token, options));
}
