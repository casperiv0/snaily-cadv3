import { NextApiResponse } from "next";
import { processQuery } from "@lib/database";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { compareSync, hashSync } from "bcryptjs";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "PUT": {
      const { oldPassword, newPassword, newPassword2 } = req.body;

      if (!oldPassword || !newPassword || !newPassword2) {
        return res.status(400).json({
          error: "Please fill in all fields",
          status: "error",
        });
      }

      const [user] = await global.connection
        .query()
        .select(["id", "password"])
        .from("users")
        .where("id", req.userId)
        .exec();

      if (!user) {
        return res.status(404).json({ error: "User was not found", status: "error" });
      }

      if (newPassword !== newPassword2) {
        return res.status(400).json({ error: "New passwords do not match", status: "error" });
      }

      const isCorrect = compareSync(oldPassword, user.password);
      if (!isCorrect) {
        return res.status(404).json({ error: "Old Password does not match!" });
      }

      const hash = hashSync(newPassword);
      await processQuery("UPDATE `users` SET `password` = ? WHERE `id` = ?", [hash, req.userId]);

      return res.json({ status: "success" });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
