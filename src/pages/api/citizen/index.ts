import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await useAuth(req, res);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (method) {
    case "GET": {
      const citizens = await processQuery("SELECT * FROM `citizens` WHERE `user_id` = ?", [
        req.userId,
      ]);

      return res.json({
        citizens,
        status: "success",
      });
    }
    case "POST": {
      // TODO: create citizen
      break;
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
