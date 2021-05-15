import { NextApiResponse } from "next";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { compareSync } from "bcryptjs";
import { User } from "types/User";
import { formatRequired } from "@lib/utils.server";
import { Cad } from "types/Cad";
import { SaveUserDataArr } from "@lib/consts";

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
      const { newUsername, passwordConfirm } = req.body;
      const [cad] = await global.connection
        .query<Cad>()
        .select("change_usernames")
        .from("cad_info")
        .exec();

      if (cad.change_usernames === "0") {
        return res.status(400).json({
          error: "This CAD has change username disabled (this can be enabled in the cad-settings).",
          status: "error",
        });
      }

      if (!newUsername || !passwordConfirm) {
        return res.status(400).json({
          error: formatRequired(["passwordConfirm", "newUsername"], req.body),
          status: "error",
        });
      }

      const [user] = await global.connection
        .query<User>()
        .select(["id", "username", "password"])
        .from("users")
        .where("id", req.userId)
        .exec();

      if (!user) {
        return res.status(404).json({ error: "User was not found", status: "error" });
      }

      if (newUsername?.toLowerCase() === user.username.toLowerCase()) {
        return res.status(400).json({ error: "Username must not be the same", status: "error" });
      }

      const [existing] = await global.connection
        .query<User>()
        .select("id")
        .from("users")
        .where("username", newUsername)
        .exec();

      if (existing?.id) {
        return res.status(400).json({
          error: "Username is already in use",
          status: "error",
        });
      }

      const isCorrect = compareSync(passwordConfirm, user.password);
      if (!isCorrect) {
        return res.status(404).json({ error: "Password is incorrect" });
      }

      await global.connection
        .query<User>()
        .update("users", {
          username: newUsername,
        })
        .where("id", req.userId)
        .exec();

      const [updated] = await global.connection
        .query<User>()
        .select(SaveUserDataArr as unknown as keyof User)
        .from("users")
        .where("id", req.userId)
        .exec();

      return res.json({ user: updated, status: "success" });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
