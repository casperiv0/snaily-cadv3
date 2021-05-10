import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { Citizen } from "types/Citizen";
import { Company } from "types/Company";
import { formatRequired } from "@lib/utils.server";

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
    case "PUT": {
      const companyId = req.query.id;
      const citizenId = req.query.citizenId;
      const employeeId = req.query.employeeId;
      const type = req.query.type;
      const body = req.body;

      if (type === "UPDATE" && (!body.rank || !body.posts || !body.can_reg_veh)) {
        return res.status(400).json({
          error: formatRequired(["rank", "posts", "can_reg_veh"], req.body),
          status: "error",
        });
      }

      if (!citizenId || !type) {
        return res.status(400).json({
          error: "`citizenId` & `type` must be provided",
          status: "error",
        });
      }

      const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
        citizenId,
      ]);
      const [company] = await processQuery<Company>("SELECT * FROM `businesses` WHERE `id` = ?", [
        companyId,
      ]);
      const [employee] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
        employeeId,
      ]);

      if (!citizen) {
        return res.status(404).json({
          error: "Citizen was not found",
          status: "error",
        });
      }
      if (!employee) {
        return res.status(404).json({
          error: "Employee was not found",
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

      if (employee.business_id !== company.id) {
        return res.status(401).json({
          error: "employee is not working at this company!",
          status: "error",
        });
      }

      if (!["owner", "manager"].includes(citizen.rank)) {
        return res.status(401).json({
          error: "Forbidden, You need to be manager or up",
          status: "error",
        });
      }

      switch (type) {
        case "UPDATE": {
          if (body.rank.toLowerCase() === "owner") {
            return res.status(400).json({
              error: "Cannot set rank to `owner`",
              status: "error",
            });
          }

          await global.connection
            .query<Citizen>()
            .update("citizens", {
              rank: body.rank,
              vehicle_reg: body.can_reg_veh,
              posts: body.posts,
              employee_of_the_month: body.employee_of_the_month,
            })
            .where("id", `${employeeId}`)
            .exec();

          break;
        }
        case "FIRE": {
          await processQuery(
            "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ?, business = ?, `business_id` = ?  WHERE `id` = ?",
            ["", "1", "1", "none", "", employeeId],
          );
          break;
        }
        case "ACCEPT":
          await processQuery(
            "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ?, `b_status` = ?  WHERE `id` = ?",
            ["employee", "1", "1", "accepted", employeeId],
          );
          break;
        case "DECLINE":
          await processQuery(
            "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ?, `b_status` = ?, business = ?, `business_id` = ?  WHERE `id` = ?",
            ["", "1", "1", "declined", "none", "", employeeId],
          );
          break;
        default: {
          return res.status(400).json({
            error: "invalid type",
            status: "error",
          });
        }
      }

      const employees = await processQuery("SELECT * FROM `citizens` WHERE `business_id` = ?", [
        companyId,
      ]);

      return res.json({
        status: "success",
        employees,
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
