import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { Company } from "types/Company";
import { Citizen } from "types/Citizen";

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
      const citizens = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `user_id` = ?", [
        req.userId,
      ]);

      const parsed = async () => {
        const arr: Company[] = [];

        await Promise.all(
          citizens
            .filter((c) => c?.business_id)
            .map(async (citizen) => {
              const [company] = await processQuery<Company>(
                "SELECT * FROM `businesses` WHERE `id` = ?",
                [citizen?.business_id],
              );

              if (company) {
                (citizen as any).company = company;

                arr.push(citizen as any);
              }
            }),
        );

        return arr;
      };

      return res.json({
        companies: await parsed(),
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
