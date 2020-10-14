import { hashSync } from "bcrypt";
import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { v4 as uuidv4 } from "uuid";
import { useToken } from "../hooks";
import IRequest from "../interfaces/IRequest";
import ICad from "../interfaces/ICad";

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
  }
});

export default router;
