import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { Company } from "types/Company";

export async function parseCompanies(data: Company[]) {
  const arr: Company[] = [];

  await Promise.all(
    data.map(async (company) => {
      const [user] = await processQuery("SELECT `username` FROM `users` WHERE `id` = ?", [
        company.user_id,
      ]);

      company.user = user as { username: string };

      arr.push(company);
    }),
  );

  return arr;
}

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
      const companies = await processQuery<Company>("SELECT * FROM `businesses` ");

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
