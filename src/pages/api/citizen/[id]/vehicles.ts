import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { formatRequired, generateString } from "@lib/utils.server";
import { v4 } from "uuid";
import { Citizen } from "types/Citizen";
import { Vehicle } from "types/Vehicle";
import { Company } from "types/Company";
import { logger } from "@lib/logger";
import { AnError } from "@lib/consts";

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method, query } = req;

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
      try {
        const vehicles = await processQuery(
          "SELECT * FROM `registered_cars` WHERE `citizen_id` = ?",
          [query.id],
        );

        return res.json({ status: "success", vehicles });
      } catch (e) {
        logger.error("GET_CITIZEN_VEHICLES", e);

        return res.status(500).json({
          error: AnError,
        });
      }
    }
    case "POST": {
      try {
        const { plate, status, color, vehicle, companyId } = req.body;

        if (!plate || !status || !color || !vehicle) {
          return res.status(400).json({
            error: formatRequired(["plate", "status", "color", "vehicle"], req.body),
            status: "error",
          });
        }

        // replace "0" with "O"
        const parsedPlate = plate.replace(/[oO]/g, "0");
        const [citizen] = await processQuery<Citizen>(
          "SELECT `full_name` FROM `citizens` WHERE `user_id` = ? AND `id` = ?",
          [req.userId, req.query.id],
        );

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        const [existingPlate] = await processQuery<Vehicle>(
          "SELECT `plate` from `registered_cars` WHERE `plate` = ?",
          [parsedPlate?.toUpperCase()],
        );

        if (existingPlate?.id) {
          return res.json({
            error: "Plate is already in use",
            status: "error",
          });
        }

        if (companyId) {
          const [company] = await processQuery<Company>(
            "SELECT * FROM `businesses` WHERE `id` = ?",
            [companyId],
          );

          if (!company) {
            return res.json({
              error: "That company was not found",
              status: "error",
            });
          }

          if (citizen.business_id !== company.id) {
            return res.json({
              error: "You are not working at that company!",
              status: "error",
            });
          }

          if (citizen.vehicle_reg === "0") {
            return res.json({
              error: "You are not allowed to register vehicles for this company",
              status: "error",
            });
          }
        }

        const id = v4();
        const vin = generateString(17);
        await processQuery(
          "INSERT INTO `registered_cars` (`id`, `owner`, `citizen_id`, `vehicle`, `vin_number`, `in_status`, `plate`, `color`, `user_id`, `business_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            id,
            citizen.full_name,
            req.query.id,
            vehicle,
            vin,
            status,
            parsedPlate,
            color,
            req.userId,
            companyId ?? "",
          ],
        );

        const updated = await processQuery(
          "SELECT * FROM `registered_cars` WHERE `citizen_id` = ? AND `user_id` = ?",
          [req.query.id, req.userId],
        );

        return res.json({ status: "success", vehicles: updated });
      } catch (e) {
        logger.error("REGISTER_VEHICLE", e);

        return res.status(500).json({
          error: AnError,
        });
      }
    }
    case "PUT": {
      try {
        const { status, color, companyId } = req.body;

        if (!status || !color || !req.query.vehicleId) {
          return res.status(400).json({
            error: formatRequired(["status", "color"], req.body),
            status: "error",
          });
        }

        const [citizen] = await processQuery<Citizen>(
          "SELECT `full_name` FROM `citizens` WHERE `user_id` = ? AND `id` = ?",
          [req.userId, req.query.id],
        );

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        if (companyId) {
          const [company] = await processQuery<Company>(
            "SELECT * FROM `businesses` WHERE `id` = ?",
            [companyId],
          );

          if (!company) {
            return res.json({
              error: "That company was not found",
              status: "error",
            });
          }

          if (citizen.business_id !== company.id) {
            return res.json({
              error: "You are not working at that company!",
              status: "error",
            });
          }

          if (citizen.vehicle_reg === "0") {
            return res.json({
              error: "You are not allowed to register vehicles for this company",
              status: "error",
            });
          }
        }

        await processQuery(
          "UPDATE `registered_cars` SET `in_status` = ?, `color` = ?, `business_id` = ? WHERE `id` = ?",
          [status, color, companyId ?? "", req.query.vehicleId],
        );

        const updated = await processQuery(
          "SELECT * FROM `registered_cars` WHERE `citizen_id` = ? AND `user_id` = ?",
          [req.query.id, req.userId],
        );

        return res.json({ status: "success", vehicles: updated });
      } catch (e) {
        logger.error("UPDATE_VEHICLE", e);

        return res.status(500).json({
          error: AnError,
        });
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
