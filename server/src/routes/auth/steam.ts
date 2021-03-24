import { Router, Response } from "express";
import BN from "bignumber.js";
import { useAuth } from "../../hooks";
import IRequest from "../../interfaces/IRequest";
import { processQuery } from "../../lib/database";
import ICad from "../../interfaces/ICad";
import fetch from "node-fetch";

const router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const callbackUrl = `${req.query.callback_url}/api/v1/auth/steam/callback?next=${req.query.callback_url}?auth=success`;
  const cadInfo = await processQuery<ICad>("SELECT `steam_api_key` FROM `cad_info`");

  if (!cadInfo[0].steam_api_key) {
    return res.json({
      error: "CAD-Owner: Please add your steam API key in the CAD-settings",
      status: "error",
    });
  }

  const url = `https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.ns.sreg=http://openid.net/extensions/sreg/1.1&openid.sreg.optional=nickname,email,fullname,dob,gender,postcode,country,language,timezone&openid.ns.ax=http://openid.net/srv/ax/1.0&openid.ax.mode=fetch_request&openid.ax.type.fullname=http://axschema.org/namePerson&openid.ax.type.firstname=http://axschema.org/namePerson/first&openid.ax.type.email=http://axschema.org/contact/email&openid.ax.required=fullname,email&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.return_to=${callbackUrl}&openid.realm=${callbackUrl}`;

  return res.redirect(url);
});

router.put("/", useAuth, async (req: IRequest, res: Response) => {
  try {
    await processQuery("UPDATE `users` SET `steam_id` = ? WHERE `id` = ?", ["", req.userId]);

    return res.json({
      status: "success",
    });
  } catch (e) {
    return res.json({
      error: "Could not unlink steam",
      status: "error",
    });
  }
});

router.get("/callback", useAuth, async (req: IRequest, res: Response) => {
  const cadInfo = await processQuery<ICad>("SELECT `steam_api_key` FROM `cad_info`");

  if (!cadInfo[0].steam_api_key) {
    return res.json({
      error: "CAD-Owner: Please add your steam API key in the CAD-settings",
      status: "error",
    });
  }

  const userSteamId = req.query["openid.identity"]
    ?.toString()
    .replace("https://steamcommunity.com/openid/id/", "");
  const steamRes = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${cadInfo[0].steam_api_key}&steamids=${userSteamId}`,
  );
  const json = await steamRes.json();

  if (!userSteamId) {
    return res.json({
      error: "Invalid SteamID",
      status: "error",
    });
  }

  const userSteamHex = new BN(userSteamId);
  const existingUser = await processQuery("SELECT `id` FROM `users` WHERE `steam_id` = ?", [
    userSteamHex.toString(16),
  ]);

  if (existingUser[0]?.id) {
    return res.json({
      error: "Another account is already connect with this Steam account.",
      status: "error",
    });
  }

  await processQuery("UPDATE `users` SET `steam_id` = ?, `avatar_url` = ? WHERE `id` =  ?", [
    userSteamHex.toString(16),
    json.response.players?.[0]?.avatar,
    req.userId,
  ]);

  const nextURL = req.query?.["next"];

  if (nextURL && typeof nextURL === "string") {
    return res.redirect(301, nextURL);
  } else {
    return res.json({
      status: "success",
      message: "You can now return to the CAD",
    });
  }
});

export default router;
