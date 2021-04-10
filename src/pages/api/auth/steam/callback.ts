import { NextApiResponse } from "next";
import BN from "bignumber.js";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { Cad } from "types/Cad";
import { User } from "types/User";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const [cad] = await processQuery<Cad>("SELECT `steam_api_key` FROM `cad_info`");

        if (!cad.steam_api_key) {
          return res.json({
            error: "CAD-Owner: Please add your steam API key in the CAD-settings",
            status: "error",
          });
        }

        const userSteamId = req.query["openid.identity"]
          ?.toString()
          .replace("https://steamcommunity.com/openid/id/", "");
        const steamRes = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${cad.steam_api_key}&steamids=${userSteamId}`,
        );
        const json = await steamRes.json();

        if (!userSteamId) {
          return res.json({
            error: "Invalid SteamID",
            status: "error",
          });
        }

        const userSteamHex = new BN(userSteamId);
        const [existingUser] = await processQuery<User>(
          "SELECT `id` FROM `users` WHERE `steam_id` = ?",
          [userSteamHex.toString(16)],
        );

        if (existingUser?.id !== req.userId && existingUser?.id) {
          return res.json({
            error: "Another account is already connected with this Steam account.",
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
      } catch (e) {
        logger.error("STEAM_CALLBACK", e);

        return res.status(500).json(AnError);
      }
    }

    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
