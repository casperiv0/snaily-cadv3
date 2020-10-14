import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import IRequest from "../interfaces/IRequest";
import { useAuth } from "../hooks";
import { RanksArr } from "../lib/constants";

const router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const bleets = await processQuery(
    "SELECT * FROM `bleets` ORDER BY `id` DESC"
  );

  return res.json({ bleets, status: "success" });
});

router.get("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const bleet = await processQuery(
    "SELECT * FROM `bleets` WHERE `bleets`.`id` = ?",
    [id]
  );

  return res.json({ status: "success", bleet });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { title, body } = req.body;
  const file = req.files?.image;
  const fileName = file?.name;
  const uploadedAt = Date.now();
  const uploadedBy = req.user?.username;

  if (title && body) {
    const bleet = await processQuery(
      "INSERT INTO `bleets` (`title`, `description`, `uploaded_by`, `uploaded_at`, `file_dir`, `pinned`, `likes`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, body, uploadedBy, uploadedAt, fileName || "", false, 0]
    );

    if (file) {
      file.mv(`./public/bleeter/${fileName}`);
    }

    return res.json({ status: "success", id: bleet.insertId });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.put("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const bleet = await processQuery(
    "SELECT * FROM `bleets` WHERE `bleets`.`id` = ?",
    [id]
  );

  if (!bleet[0]) {
    return res.json({
      error: "Bleet was not found",
      status: "error",
    });
  }

  if (bleet[0].uploaded_by !== req.user?.username) {
    return res.json({
      error: "Forbidden",
      status: "error",
    });
  }

  const { title, body } = req.body;
  const file = req.files?.image;
  const fileName = file?.name || "";

  let query = "";
  let data = [];

  if (file) {
    query =
      "UPDATE `bleets` SET `title` = ?, `description` = ?, `file_dir` = ? WHERE `bleets`.`id` = ?";
    data = [title, body, fileName, id];
  } else {
    query =
      "UPDATE `bleets` SET `title` = ?, `description` = ? WHERE `bleets`.`id` = ?";
    data = [title, body, id];
  }

  await processQuery(query, data);

  if (file) {
    file.mv(`./public/bleeter/${fileName}`);
  }

  return res.json({ status: "success", bleet });
});

router.delete("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const rank = String(req.user?.rank);

  if (!RanksArr.includes(rank)) {
    return res.json({ error: "Forbidden", status: "error" });
  }

  await processQuery("DELETE FROM `bleets` WHERE `bleets`.`id` = ?", [id]);

  return res.json({ status: "success" });
});

export default router;
