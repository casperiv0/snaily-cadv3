import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
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
    case "GET": {
      const companies = await processQuery<Company>(
        "SELECT * FROM `businesses` WHERE `user_id` = ?",
        [req.userId],
      );

      const parsed = async () => {
        const arr: Company[] = [];

        await Promise.all(
          companies.map(async (company) => {
            const [
              citizen,
            ] = await processQuery(
              "SELECT `id`, `full_name`, `rank` FROM `citizens` WHERE `id` = ?",
              [company?.citizen_id],
            );

            (company as any).citizen = citizen;
            arr.push(company!);
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
