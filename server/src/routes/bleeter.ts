import { Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { processQuery } from "../lib/database";
import { useAuth, useMarkdown } from "../hooks";
import { RanksArr, SupportedFileTypes } from "../lib/constants";
import IRequest from "../interfaces/IRequest";
import IUser from "../interfaces/IUser";

const router = Router();

router.get("/", useAuth, async (_req, res: Response) => {
  const bleets = await processQuery("SELECT * FROM `bleets` ORDER BY `id` DESC");

  return res.json({ bleets, status: "success" });
});

router.get("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const bleet = await processQuery("SELECT * FROM `bleets` WHERE `bleets`.`id` = ?", [id]);
  const uploadedBy = await processQuery("SELECT `username` FROM `users` WHERE `id` = ?", [
    bleet[0].user_id,
  ]);

  return res.json({
    status: "success",
    bleet: { ...bleet[0], uploadedBy: uploadedBy[0].username },
  });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { title, body } = req.body;
  const file = req.files?.image as UploadedFile;
  const uploadedAt = Date.now();
  const user_id = req.userId;
  const index = req.files?.image && file?.name.indexOf(".");
  const imageId = file ? `${uuidv4()}${file.name.slice(index)}` : "";

  if (file && !SupportedFileTypes.includes(file.mimetype)) {
    return res.json({
      status: "error",
      error: `Image type is not supported, supported: ${SupportedFileTypes.join(", ")}`,
    });
  }

  if (title && body) {
    const markdown = useMarkdown(body);
    const id = uuidv4();

    await processQuery(
      "INSERT INTO `bleets` (`id`, `title`, `body`, `markdown`, `user_id`, `uploaded_at`, `image_id`, `pinned`, `likes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, title, body, markdown, user_id, uploadedAt, imageId, false, 0],
    );

    if (file) {
      file.mv(`./public/bleeter-images/${imageId}`);
    }

    const bleets = await processQuery("SELECT * FROM `bleets` ORDER BY `id` DESC");
    return res.json({ status: "success", bleets });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.put("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const bleet = await processQuery("SELECT * FROM `bleets` WHERE `bleets`.`id` = ?", [id]);
  const uploadedBy = await processQuery("SELECT `username` FROM `users` WHERE `id` = ?", [
    bleet[0].user_id,
  ]);

  if (!bleet[0]) {
    return res.json({
      error: "Bleet was not found",
      status: "error",
    });
  }

  if (bleet[0].user_id !== req.userId) {
    return res.json({
      error: "Forbidden",
      status: "error",
    });
  }

  const { title, body } = req.body;

  if (title && body) {
    const file = req.files?.image as UploadedFile;
    const fileName = file?.name ?? "";
    const markdown = useMarkdown(body);

    let query = "";
    let data = [];

    if (file) {
      query =
        "UPDATE `bleets` SET `title` = ?, `body` = ?, `markdown` = ?, `file_dir` = ? WHERE `bleets`.`id` = ?";
      data = [title, body, markdown, fileName, id];
    } else {
      query = "UPDATE `bleets` SET `title` = ?, `body` = ?, `markdown` = ? WHERE `bleets`.`id` = ?";
      data = [title, body, markdown, id];
    }

    await processQuery(query, data);

    if (file) {
      file.mv(`./public/bleeter/${fileName}`);
    }

    const updated = await processQuery("SELECT * FROM `bleets` WHERE `bleets`.`id` = ?", [id]);
    return res.json({
      status: "success",
      bleet: {
        uploadedBy: uploadedBy[0].username,
        ...updated[0],
      },
    });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.delete("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const user = await processQuery<IUser>("SELECT `rank` FROM `users` WHERE `id` = ?", [req.userId]);
  const rank = user[0].rank;
  const bleet = await processQuery("SELECT * FROM `bleets` WHERE `id` = ?", [id]);

  if (!bleet[0]) {
    return res.json({ status: "error", error: "Bleet was not found" });
  }

  if (RanksArr.includes(rank) || bleet[0].user_id === req.userId) {
    await processQuery("DELETE FROM `bleets` WHERE `bleets`.`id` = ?", [id]);

    return res.json({ status: "success" });
  } else {
    return res.json({ error: "Forbidden", status: "error" });
  }
});

export default router;
