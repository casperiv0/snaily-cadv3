import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { logger } from "@lib/logger";
import { Call } from "types/Call";
import { IRequest } from "types/IRequest";
import { SocketEvents } from "types/Socket";

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
        const events = await global.connection
          .query()
          .select("*")
          .from("call_events")
          .where("call_id", call.id)
          .exec();

        call.events = events;

        arr.push(call);
      }),
    );

    return arr;
  };

  return await callsWithEvents();
}

export default async function handler(req: IRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    try {
      await useAuth(req);
    } catch (e) {
      return res.status(e?.code ?? 400).json({
        status: "error",
        error: e,
      });
    }
  }

  switch (req.method) {
    case "GET": {
      try {
        const calls = await global.connection
          .query<Call>()
          .select("*")
          .from(dbPath(`${req.query.type}`))
          .exec();

        return res.json({
          calls: req.query.type === "911" ? await mapCalls(calls as Call[]) : calls,
          status: "success",
        });
      } catch (e) {
        logger.error("get_calls", e);

        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      try {
        const { description = "N/A", caller, location, type = "1", coords: coordsArr } = req.body;
        const id = v4();

        switch (req.query.type) {
          case "911": {
            const coords = {
              x: coordsArr?.[0] || 0,
              y: coordsArr?.[1] || 0,
              z: coordsArr?.[2] || 0,
            };

            await global.connection
              .query<Call>()
              .insert("911calls", {
                id,
                description,
                name: caller || "Unknown",
                location: location || "Unknown",
                status: "Not Assigned",
                assigned_unit: "[]" as any,
                pos: JSON.stringify(coords),
                hidden: coordsArr ? "0" : "1",
                type,
              })
              .exec();

            global?.io?.sockets?.emit?.(SocketEvents.New911Call, {
              description,
              caller,
              location,
            });
            global?.io?.sockets?.emit?.(SocketEvents.Update911Calls);
            break;
          }
          case "tow": {
            await global.connection
              .query<Call>()
              .insert("tow_calls", {
                id,
                description,
                name: caller || "Unknown",
                location: location || "Unknown",
              })
              .exec();

            global?.io?.sockets?.emit?.(SocketEvents.UpdateTowCalls);
            break;
          }
          case "taxi": {
            await global.connection
              .query<Call>()
              .insert("taxi_calls", {
                id,
                description,
                name: caller || "Unknown",
                location: location || "Unknown",
              })
              .exec();

            global?.io?.sockets?.emit?.(SocketEvents.UpdateTaxiCalls);
            break;
          }
          default: {
            return res.status(400).json({
              error: "Invalid type",
              status: "error",
            });
          }
        }

        const calls = await global.connection
          .query<Call>()
          .select("*")
          .from(dbPath(`${req.query.type}`))
          .exec();

        return res.json({
          calls: req.query.type === "911" ? await mapCalls(calls as Call[]) : calls,
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
