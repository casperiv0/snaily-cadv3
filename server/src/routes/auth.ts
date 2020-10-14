import { compareSync, hashSync } from "bcrypt";
import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { v4 as uuidv4 } from "uuid";
import { useToken } from "../hooks";
import IRequest from "../interfaces/IRequest";
import ICad from "../interfaces/ICad";
import IUser from "../interfaces/IUser";

const enum Ranks {
  user = "user",
  owner = "owner",
}

const enum Whitelist {
  accepted = "accepted",
  pending = "pending",
  declined = "declined",
}

const saltRounds = 15;
const router: Router = Router();

router.post("/register", async (req: IRequest, res: Response) => {
  const { username, password, password2 } = req.body;

  if (username && password && password2) {
    // check if passwords are the same
    if (password !== password2) {
      return res.json({ status: "error", error: "Passwords do not match" });
    }

    const existing = await processQuery(
      "SELECT * FROM `users` WHERE `username` = ?",
      [username]
    );

    if (existing?.length > 0) {
      return res.json({
        status: "error",
        error: "Username is already in use, please use a different username",
      });
    }

    const hash = hashSync(password, saltRounds);
    const users = await processQuery("SELECT `username` FROM `users`");
    const cadInfo: ICad[] = await processQuery("SELECT * FROM `cad_info`");

    // There are existing users - create the account at user level
    if (users?.length > 0) {
      const whitelistStatus =
        +cadInfo[0].whitelisted === 1 ? "pending" : "accepted";
      const towAccess = +cadInfo[0].tow_whitelisted === 1 ? false : true;
      const id = uuidv4();

      await processQuery(
        "INSERT INTO `users` (`id`, `username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `dispatch_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id /* id */,
          username /* username */,
          hash /* passowrd */,
          Ranks.user /* rank */,
          false /* leo access */,
          false /* ems_fd access */,
          false /* dispatch access */,
          towAccess /* tow access */,
          false /* banned */,
          "" /* ban_reason */,
          whitelistStatus /* whitelist_status */,
          "" /* dispatch_status */,
        ]
      );

      const token = useToken({ id, username });

      res.cookie("__token", token, { expires: new Date(Date.now() + 3600000) });

      return res.json({ status: "success" });
    } else {
      // no users found - create the account at owner level
      const id = uuidv4();
      await processQuery(
        "INSERT INTO `users` (`id`, `username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `dispatch_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id /* id */,
          username /* username */,
          hash /* passowrd */,
          Ranks.owner /* rank */,
          true /* leo access */,
          true /* ems_fd access */,
          true /* dispatch access */,
          true /* tow access */,
          false /* banned */,
          "" /* ban_reason */,
          Whitelist.accepted /* whitelist_status */,
          "" /* dispatch_status */,
        ]
      );

      const token = useToken({ id, username });

      res.cookie("__token", token, { expires: new Date(Date.now() + 3600000) });

      return res.json({ status: "success" });
    }
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.post("/login", async (req: IRequest, res: Response) => {
  const { username, password } = req.body;

  if (username && password) {
    const user: IUser[] = await processQuery(
      "SELECT * FROM `users` WHERE `username` = ?",
      [username]
    );

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

    if (+user[0].banned === 1) {
      return res.json({
        status: "error",
        error: `This account was banned, reason: ${user[0].ban_reason}`,
      });
    }

    if (user[0].whitelist_status === Whitelist.pending) {
      return res.json({
        error: "This account is still pending access",
        status: "error",
      });
    }

    const token = useToken({ id: user[0].id, username: user[0].username });
    res.cookie("__token", token, { expires: new Date(Date.now() + 3600000) });

    return res.json({ status: "success" });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

export default router;
