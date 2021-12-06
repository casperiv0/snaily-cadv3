import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { IRequest } from "types/IRequest";
import { Citizen } from "types/Citizen";
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

      const [citizen] = await global.connection
        .query<Citizen>()
        .select("*")
        .from("citizens")
        .where("id", `${citizenId}`)
        .exec();

      const [company] = await global.connection
        .query<Company>()
        .select("*")
        .from("businesses")
        .where("id", `${companyId}`)
        .exec();

      const [employee] = await global.connection
        .query<Citizen>()
        .select("*")
        .from("citizens")
        .where("id", `${employeeId}`)
        .exec();

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
          await global.connection
            .query<Citizen>()
            .update("citizens", {
              rank: "",
              posts: "1",
              vehicle_reg: "1",
              business: "none",
              business_id: "",
              b_status: "",
            })
            .where("id", `${employeeId}`)
            .exec();

          break;
        }
        case "ACCEPT":
          await global.connection
            .query<Citizen>()
            .update("citizens", {
              rank: "employee",
              posts: "1",
              b_status: "accepted",
              vehicle_reg: "1",
            })
            .where("id", `${employeeId}`)
            .exec();

          break;
        case "DECLINE":
          await global.connection
            .query<Citizen>()
            .update("citizens", {
              rank: "",
              posts: "1",
              vehicle_reg: "1",
              business: "none",
              business_id: "",
              b_status: "declined",
            })
            .where("id", `${employeeId}`)
            .exec();

          break;
        default: {
          return res.status(400).json({
            error: "invalid type",
            status: "error",
          });
        }
      }

      const employees = await global.connection
        .query<Citizen>()
        .select("*")
        .where("business_id", `${companyId}`)
        .from("citizens")
        .exec();

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
