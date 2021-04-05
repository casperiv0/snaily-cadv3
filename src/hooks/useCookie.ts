import { NextApiResponse } from "next";
import { serialize, CookieSerializeOptions } from "cookie";
import { Auth } from "@lib/consts";

export function useCookie(res: NextApiResponse, token: string) {
  const options: CookieSerializeOptions = {
    expires: new Date(Date.now() + Auth.CookieExpires),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  };

  res.setHeader("Set-Cookie", serialize("snaily-cad-session", token, options));
}
