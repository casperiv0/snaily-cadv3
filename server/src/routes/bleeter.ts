import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import IRequest from "../interfaces/IRequest";
import { useAuth } from "../hooks";

const router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const bleets = await processQuery(
    "SELECT * FROM `bleets` ORDER BY `id` DESC"
  );

  return res.json({ bleets, status: "success" });
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

export default router;
