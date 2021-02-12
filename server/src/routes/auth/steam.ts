import { Router, Response } from "express";
import BN from "bignumber.js";
import { useAuth } from "../../hooks";
import IRequest from "../../interfaces/IRequest";
import { processQuery } from "../../lib/database";

const router = Router();

router.get("/", useAuth, async (_, res: Response) => {
  const url =
    "https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.ns.sreg=http://openid.net/extensions/sreg/1.1&openid.sreg.optional=nickname,email,fullname,dob,gender,postcode,country,language,timezone&openid.ns.ax=http://openid.net/srv/ax/1.0&openid.ax.mode=fetch_request&openid.ax.type.fullname=http://axschema.org/namePerson&openid.ax.type.firstname=http://axschema.org/namePerson/first&openid.ax.type.email=http://axschema.org/contact/email&openid.ax.required=fullname,email&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.return_to=http://localhost:3030/api/v1/auth/steam/callback&openid.realm=http://localhost:3030/api/v1/auth/steam/callback";

  return res.redirect(url);
});

router.get("/callback", useAuth, async (req: IRequest, res: Response) => {
  const userSteamId = req.query["openid.identity"]?.toString().replace("https://steamcommunity.com/openid/id/", "");
  if (!userSteamId)
    return res.json({
      error: "Invalid SteamID",
      status: "error",
    });

  const userSteamHex = new BN(userSteamId);

  await processQuery("UPDATE `users` SET `steam_id` = ? WHERE `id` =  ?", [userSteamHex.toString(16), req.user?.id]);

  return res.json({
    status: "success",
  });
});

export default router;
