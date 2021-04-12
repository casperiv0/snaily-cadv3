import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { Citizen } from "types/Citizen";
import { RanksArr } from "@lib/consts";
import { User } from "types/User";
import { parseCompanies } from "..";
import { Company } from "types/Company";

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (method) {
    case "DELETE": {
      const citizenId = req.query.citizenId;

      const [user] = await processQuery<User>("SELECT `rank` FROM `users` WHERE `id` = ?", [
        req.userId,
      ]);
      const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
        citizenId,
      ]);

      if (!RanksArr.includes(user.rank)) {
        if (!citizen) {
          return res.json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        if (citizen.rank !== "owner") {
          return res.json({
            error: "Forbidden",
            status: "error",
          });
        }
      }

      await processQuery(
        "UPDATE `citizens` SET `business` = ?, `business_id` = ?, `rank` = ? WHERE `business_id` = ?",
        ["none", "", "", req.query.id],
      );
      await processQuery("DELETE FROM `businesses` WHERE `id` = ?", [req.query.id]);

      const companies = await processQuery<Company>("SELECT * FROM `businesses`");
      return res.json({
        companies: await parseCompanies(companies),
        status: "success",
      });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
