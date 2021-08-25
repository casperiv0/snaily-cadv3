import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { processQuery } from "lib/database";
import { IRequest } from "types/IRequest";
import { Citizen } from "types/Citizen";
import { RanksArr, Whitelist } from "lib/consts";
import { User } from "types/User";
import { parseCompanies } from "..";
import { Company } from "types/Company";
import { formatRequired } from "lib/utils.server";

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
    case "GET": {
      const companyId = req.query.id;
      const citizenId = req.query.citizenId;

      if (!citizenId) {
        return res.status(400).json({
          error: "`citizenId` must be provided",
          status: "error",
        });
      }

      const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
        citizenId,
      ]);
      const [company] = await processQuery<Company>("SELECT * FROM `businesses` WHERE `id` = ?", [
        companyId,
      ]);

      if (!citizen) {
        return res.status(404).json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      if (!company) {
        return res.status(404).json({
          error: "Company was not found",
          status: "error",
        });
      }

      if (citizen.b_status === Whitelist.Pending) {
        return res.status(404).json({
          error: "You are still awaiting access to this company",
          status: "error",
        });
      }

      if (citizen.business_id !== company.id) {
        return res.status(401).json({
          error: "You are not working at this company!",
          status: "error",
        });
      }

      const posts = await processQuery(
        "SELECT * FROM `posts` WHERE `business_id` = ? ORDER BY `uploaded_at` DESC",
        [companyId],
      );
      const employees = await processQuery("SELECT * FROM `citizens` WHERE `business_id` = ?", [
        companyId,
      ]);
      const vehicles = await processQuery(
        "SELECT * FROM `registered_cars` WHERE `business_id` = ?",
        [companyId],
      );

      return res.json({
        company,
        posts,
        employees,
        vehicles,
        status: "success",
      });
    }
    case "PUT": {
      const companyId = req.query.id;
      const citizenId = req.query.citizenId;
      const { name, whitelisted, address } = req.body;

      if (!name || !whitelisted || !address) {
        return res.status(400).json({
          error: formatRequired(["name", "whitelisted", "address"], req.body),
          status: "error",
        });
      }

      if (!citizenId) {
        return res.status(400).json({
          error: "`citizenId` must be provided",
          status: "error",
        });
      }

      const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
        citizenId,
      ]);
      const [company] = await processQuery<Company>("SELECT * FROM `businesses` WHERE `id` = ?", [
        companyId,
      ]);

      if (!citizen) {
        return res.status(404).json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      if (!company) {
        return res.status(404).json({
          error: "Company was not found",
          status: "error",
        });
      }

      if (citizen.business_id !== company.id) {
        return res.status(401).json({
          error: "You are not working at this company!",
          status: "error",
        });
      }

      if (citizen.rank !== "owner") {
        return res.status(401).json({
          error: "Forbidden",
          status: "error",
        });
      }

      if (name.toLowerCase() !== company.name.toLowerCase()) {
        const existing = await processQuery("SELECT * FROM `businesses` WHERE `name` = ?", [name]);

        if (existing[0]) {
          return res.status(400).json({
            error: "Name is already in use",
            status: "error",
          });
        }
      }

      await processQuery(
        "UPDATE `businesses` SET `name` = ?, `address` = ?, `whitelisted` = ? WHERE `id` = ?",
        [name, address, whitelisted, companyId],
      );

      return res.json({ status: "success" });
    }

    case "DELETE": {
      const citizenId = req.query.citizenId;

      const [user] = await processQuery<User>("SELECT `rank` FROM `users` WHERE `id` = ?", [
        req.userId,
      ]);
      const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
        citizenId,
      ]);

      if (!RanksArr.includes(user?.rank ?? "user")) {
        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        if (citizen.rank !== "owner") {
          return res.status(403).json({
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
        companies: await parseCompanies(companies as Company[]),
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
