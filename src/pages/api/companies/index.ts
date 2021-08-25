import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { IRequest } from "types/IRequest";
import { Company } from "types/Company";
import { User } from "types/User";

export async function parseCompanies(data: Company[]) {
  const arr: Company[] = [];

  await Promise.all(
    data.map(async (company) => {
      const [user] = await global.connection
        .query<User>()
        .select("username")
        .from("users")
        .where("id", company.user_id)
        .exec();

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
      const companies = await global.connection
        .query<Company>()
        .select("*")
        .from("businesses")
        .exec();

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
