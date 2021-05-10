import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { Cad } from "types/Cad";

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
        const host = req.headers["host"];
        const callbackUrl = `http://${host}/api/auth/steam/callback?next=http://${host}/account?auth=success`;
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

        const url = `https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.ns.sreg=http://openid.net/extensions/sreg/1.1&openid.sreg.optional=nickname,email,fullname,dob,gender,postcode,country,language,timezone&openid.ns.ax=http://openid.net/srv/ax/1.0&openid.ax.mode=fetch_request&openid.ax.type.fullname=http://axschema.org/namePerson&openid.ax.type.firstname=http://axschema.org/namePerson/first&openid.ax.type.email=http://axschema.org/contact/email&openid.ax.required=fullname,email&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.return_to=${callbackUrl}&openid.realm=${callbackUrl}`;
        return res.redirect(url);
      } catch (e) {
        logger.error("LINK_STEAM", e);

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
