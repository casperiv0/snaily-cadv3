import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { Response, Router } from "express";
import { processQuery } from "../../lib/database";
import { v4 as uuidv4 } from "uuid";
import { useAuth, useToken } from "../../hooks";
import { CookieExpiresIn, Ranks, SaveUserQueryData, Whitelist } from "../../lib/constants";
import IRequest from "../../interfaces/IRequest";
import ICad from "../../interfaces/ICad";
import IUser from "../../interfaces/IUser";
import Citizen from "../../interfaces/Citizen";
import { checkForInvalidChars, logoutActiveUnits, serializeUsername } from "../../lib/functions";

export const saltRounds = genSaltSync(10);
const router: Router = Router();

router.post("/register", async (req: IRequest, res: Response) => {
  const { username, password, password2 } = req.body;

  if (username && password && password2) {
    if (checkForInvalidChars(username)) {
      return res.json({
        error: "Username contains special characters, please remove them.",
        status: "error",
      });
    }

    // check if passwords are the same
    if (password !== password2) {
      return res.json({ status: "error", error: "Passwords do not match" });
    }

    const existing = await processQuery<IUser>("SELECT * FROM `users` WHERE `username` = ?", [
      serializeUsername(username),
    ]);

    if (existing?.length > 0) {
      return res.json({
        status: "error",
        error: "Username is already in use, please use a different username",
      });
    }

    const hash = hashSync(password, saltRounds);
    const users = await processQuery<IUser>("SELECT `username` FROM `users`");
    const insertSQL =
      "INSERT INTO `users` (`id`, `username`, `password`, `rank`, `leo`, `supervisor`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `edit_passwords`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // There are existing users - create the account at user level
    if (users?.length > 0) {
      const cadInfo = await processQuery<ICad>("SELECT * FROM `cad_info`");
      const whitelistStatus = cadInfo[0].whitelisted === "1" ? "pending" : "accepted";
      const towAccess = cadInfo[0].tow_whitelisted === "1" ? false : true;
      const id = uuidv4();

      await processQuery(insertSQL, [
        id /* id */,
        serializeUsername(username) /* username */,
        hash /* password */,
        Ranks.user /* rank */,
        false /* leo access */,
        false /* supervisor access */,
        false /* ems_fd access */,
        false /* dispatch access */,
        towAccess /* tow access */,
        false /* banned */,
        "" /* ban_reason */,
        whitelistStatus /* whitelist_status */,
        "" /* steam_id */,
        "" /* avatar_url */,
        "0" /* edit_passwords */,
      ]);

      if (cadInfo[0].whitelisted === "1") {
        return res.json({
          status: "error",
          error:
            "Your account was created successfully, this CAD is whitelisted so your account is still pending access",
        });
      }

      const token = useToken({ id });

      res.cookie("snaily-cad-session", token, {
        expires: new Date(Date.now() + CookieExpiresIn),
        httpOnly: true,
      });

      return res.json({
        status: "success",
      });
    } else {
      // no users found - create the account at owner level
      const id = uuidv4();
      const features = ["bleeter", "tow", "taxi", "courthouse", "truck-logs"];
      await processQuery(
        "INSERT INTO `cad_info` (`owner`, `cad_name`, `AOP`, `tow_whitelisted`, `whitelisted`, `webhook_url`, `live_map_url`, `plate_length`, `signal_100`, `steam_api_key`, `features`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          username,
          "Change me",
          "Change me",
          "0",
          "0",
          "",
          "",
          8,
          "0",
          "",
          JSON.stringify(features),
        ],
      );
      await processQuery(insertSQL, [
        id /* id */,
        serializeUsername(username) /* username */,
        hash /* password */,
        Ranks.owner /* rank */,
        true /* leo access */,
        true /* supervisor access */,
        true /* ems_fd access */,
        true /* dispatch access */,
        true /* tow access */,
        false /* banned */,
        "" /* ban_reason */,
        Whitelist.accepted /* whitelist_status */,
        "" /* steam_id */,
        "" /* avatar_url */,
        "1",
      ]);

      const token = useToken({ id });

      res.cookie("snaily-cad-session", token, {
        expires: new Date(Date.now() + CookieExpiresIn),
        httpOnly: true,
      });

      return res.json({ status: "success" });
    }
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.post("/login", async (req: IRequest, res: Response) => {
  const { username, password } = req.body;

  if (username && password) {
    const user = await processQuery<IUser>("SELECT * FROM `users` WHERE `username` = ?", [
      username,
    ]);
    const cadInfo = await processQuery<ICad>("SELECT * FROM `cad_info`");

    if (!user[0]) {
      return res.json({ error: "User was not found", status: "error" });
    }

    const isCorrect = compareSync(password, user[0].password);

    if (!isCorrect) {
      return res.json({
        error: "Password is incorrect",
        status: "error",
      });
    }

    if (user[0].banned === "1") {
      return res.json({
        status: "error",
        error: `This account was banned, reason: ${user[0].ban_reason}`,
      });
    }

    if (cadInfo[0].whitelisted === "1" && user[0].whitelist_status === Whitelist.pending) {
      return res.json({
        error: "This account is still pending access",
        status: "error",
      });
    }

    const token = useToken({ id: user[0].id });
    res.cookie("snaily-cad-session", token, {
      expires: new Date(Date.now() + CookieExpiresIn),
      httpOnly: true,
    });

    return res.json({ status: "success" });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.post("/user", useAuth, async (req: IRequest, res: Response) => {
  const user = await processQuery(`SELECT ${SaveUserQueryData} FROM \`users\` WHERE \`id\` = ?`, [
    req.userId,
  ]);

  return res.json({ user: user[0], status: "success" });
});

router.get("/logout", useAuth, async (req: IRequest, res: Response) => {
  logoutActiveUnits(req.userId);

  res.clearCookie("snaily-cad-session", { httpOnly: true });

  return res.json({ status: "success" });
});

router.delete("/delete-account", useAuth, async (req: IRequest, res: Response) => {
  const user = await processQuery<IUser>("SELECT `rank` FROM `users` WHERE `id` = ?", [req.userId]);

  if (user[0].rank === "owner") {
    return res.json({
      error: "The owner is not able to delete their account!",
      status: "error",
    });
  }

  const citizens = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `user_id` = ?", [
    req.userId,
  ]);

  await Promise.all(
    citizens.map(async (citizen) => {
      await processQuery("DELETE FROM `arrest_reports` WHERE `citizen_id` = ?", [citizen.id]);
      await processQuery("DELETE FROM `businesses` WHERE `citizen_id` = ?", [citizen.id]);
      await processQuery("DELETE FROM `leo_tickets` WHERE `citizen_id` = ?", [citizen.id]);
      await processQuery("DELETE FROM `medical_records` WHERE `citizen_id` = ?", [citizen.id]);
      await processQuery("DELETE FROM `registered_cars` WHERE `citizen_id` = ?", [citizen.id]);
      await processQuery("DELETE FROM `registered_weapons` WHERE `citizen_id` = ?", [citizen.id]);
      await processQuery("DELETE FROM `warrants` WHERE `citizen_id` = ?", [citizen.id]);
      await processQuery("DELETE FROM `written_warnings` WHERE `citizen_id` = ?", [citizen.id]);
    }),
  );

  await Promise.all([
    await processQuery("DELETE FROM `posts` WHERE `user_id` = ?", [req.userId]),
    await processQuery("DELETE FROM `truck_logs` WHERE `user_id` = ?", [req.userId]),
    await processQuery("DELETE FROM `officers` WHERE `user_id` = ?", [req.userId]),
    await processQuery("DELETE FROM `ems-fd` WHERE `user_id` = ?", [req.userId]),
    await processQuery("DELETE FROM `bleets` WHERE `user_id` = ?", [req.userId]),
    await processQuery("DELETE FROM `citizens` WHERE `user_id` = ?", [req.userId]),
    await processQuery("DELETE FROM `users` WHERE `id` = ?", [req.userId]),
  ]);

  return res.json({ status: "success" });
});

router.put("/update-pw", useAuth, async (req: IRequest, res: Response) => {
  const userId = req.userId;
  const { oldPassword, newPassword, newPassword2 } = req.body;

  if (oldPassword && newPassword && newPassword2) {
    const user = await processQuery<IUser>("SELECT * FROM `users` WHERE `id` = ?", [userId]);

    if (!user[0]) {
      return res.json({ error: "User was not found", status: "error" });
    }

    if (newPassword !== newPassword2) {
      return res.json({ error: "New passwords do not match", status: "error" });
    }

    const isCorrect = compareSync(oldPassword, user[0].password);

    if (!isCorrect) {
      return res.json({ error: "Old Password does not match!" });
    }

    const hash = hashSync(newPassword);
    await processQuery("UPDATE `users` SET `password` = ? WHERE `id` = ?", [hash, userId]);

    return res.json({ status: "success" });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

export default router;
