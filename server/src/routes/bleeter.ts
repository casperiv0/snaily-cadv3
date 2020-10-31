import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth, useMarkdown } from "../hooks";
import { RanksArr } from "../lib/constants";
import { v4 as uuidv4 } from "uuid";
import IRequest from "../interfaces/IRequest";

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

  return res.json({ status: "success", bleet: bleet[0] });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { title, body } = req.body;
  const file = req.files?.image;
  const fileName = file?.name;
  const uploadedAt = Date.now();
  const user_id = req.user?.id;

  if (title && body) {
    const markdown = useMarkdown(body);
    const id = uuidv4();

    await processQuery(
      "INSERT INTO `bleets` (`id`, `title`, `body`, `markdown`, `user_id`, `uploaded_at`, `file_dir`, `pinned`, `likes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, title, body, markdown, user_id, uploadedAt, fileName || "", false, 0]
    );

    if (file) {
      file.mv(`./public/bleeter/${fileName}`);
    }

    return res.json({ status: "success", id: id });
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

  if (bleet[0].user_id !== req.user?.id) {
    return res.json({
      error: "Forbidden",
      status: "error",
    });
  }

  const { title, body } = req.body;

  if (title && body) {
    const file = req.files?.image;
    const fileName = file?.name || "";
    const markdown = useMarkdown(body);

    let query = "";
    let data = [];

    if (file) {
      query =
        "UPDATE `bleets` SET `title` = ?, `body` = ?, `markdown` = ?, `file_dir` = ? WHERE `bleets`.`id` = ?";
      data = [title, body, markdown, fileName, id];
    } else {
      query =
        "UPDATE `bleets` SET `title` = ?, `body` = ?, `markdown` = ? WHERE `bleets`.`id` = ?";
      data = [title, body, markdown, id];
    }

    await processQuery(query, data);

    if (file) {
      file.mv(`./public/bleeter/${fileName}`);
    }

    return res.json({ status: "success", bleet });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
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
