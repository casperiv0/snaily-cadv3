import { NextApiResponse } from "next";
import BN from "bignumber.js";
import { AnError } from "@lib/consts";
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
        const [cad] = await global.connection
          .query<Cad>()
          .select("steam_api_key")
          .from("cad_info")
          .exec();

        if (!cad?.steam_api_key) {
          return res.status(400).json({
            error: "CAD-Owner: Please add your steam API key in the CAD-settings",
            status: "error",
          });
        }

        const userSteamId = req.query["openid.identity"]
          ?.toString()
          .replace("https://steamcommunity.com/openid/id/", "");
        const steamRes = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${cad?.steam_api_key}&steamids=${userSteamId}`,
        );
        const json = await steamRes.json();

        if (!userSteamId) {
          return res.status(400).json({
            error: "Invalid SteamID",
            status: "error",
          });
        }

        const userSteamHex = new BN(userSteamId);
        const [existingUser] = await global.connection
          .query<User>()
          .select("id")
          .from("users")
          .where("steam_id", userSteamHex.toString(16))
          .exec();

        if (existingUser?.id !== req.userId && existingUser?.id) {
          return res.status(400).json({
            error: "Another account is already connected with this Steam account.",
            status: "error",
          });
        }

        await global.connection
          .query<User>()
          .update("users", {
            steam_id: userSteamHex.toString(16),
            avatar_url: json.response.players?.[0]?.avatar,
          })
          .where("id", req.userId)
          .exec();

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
