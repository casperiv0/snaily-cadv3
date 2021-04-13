import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { Call } from "types/Call";
import { IRequest } from "types/IRequest";

export const dbPath = (path: string) =>
  path === "911" ? "911calls" : path === "taxi" ? "taxi_calls" : "tow_calls";

export async function mapCalls(calls: Call[]) {
  calls = calls.map((call) => {
    try {
      call.assigned_unit = JSON.parse(
        (typeof call.assigned_unit === "string" && call.assigned_unit) || "[]",
      );
    } catch {
      call.assigned_unit = [];
    }
    try {
      (call as any).pos = JSON.parse((call as any).pos);
    } catch {
      (call as any).pos = { x: 0, y: 0, z: 0 };
    }

    return call;
  });

  const callsWithEvents = async () => {
    const arr: any[] = [];

    await Promise.all(
      calls.map(async (call) => {
        const events = await processQuery("SELECT * FROM `call_events` WHERE `call_id` = ?", [
          call.id,
        ]);

        // @ts-expect-error please ignore the line below.
        call.events = events;

        arr.push(call);
      }),
    );

    return arr;
  };

  return await callsWithEvents();
}

export default async function handler(req: IRequest, res: NextApiResponse) {
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
        const calls = await processQuery<Call>(`SELECT * FROM \`${dbPath(`${req.query.type}`)}\``);

        return res.json({
          calls: req.query.type === "911" ? await mapCalls(calls) : calls,
          status: "success",
        });
      } catch (e) {
        logger.error("get_calls", e);

        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      try {
        const { description = "N/A", caller, location } = req.body;
        const id = v4();

        if (req.query.type === "911") {
          await processQuery(
            `INSERT INTO \`${dbPath(
              `${req.query.type}`,
            )}\` (\`id\`, \`description\`, \`name\`, \`location\`) VALUES (?, ?, ?, ?)`,
            [id, description, caller, location],
          );
        } else {
          // TODO
        }

        const calls = await processQuery<Call>(`SELECT * FROM \`${dbPath(`${req.query.type}`)}\``);
        return res.json({
          calls: req.query.type === "911" ? await mapCalls(calls) : calls,
          status: "success",
        });
      } catch (e) {
        logger.error("cad-info", e);

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
