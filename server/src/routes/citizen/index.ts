import { Response, Router } from "express";
import { processQuery } from "../../lib/database";
import { useAuth } from "../../hooks";
import { v4 as uuidv4, v4 } from "uuid";
import IRequest from "../../interfaces/IRequest";
import Logger from "../../lib/Logger";
const router: Router = Router();
import citizenWeaponRouter from "./weapons";
import citizenVehicleRouter from "./vehicles";
import medicalRecordsRouter from "./medical-records";
import companyRouter from "./company";
import { UploadedFile } from "express-fileupload";
import { SupportedFileTypes } from "../../lib/constants";
import Citizen from "../../interfaces/Citizen";

router.use("/weapons", citizenWeaponRouter);
router.use("/vehicles", citizenVehicleRouter);
router.use("/medical-records", medicalRecordsRouter);
router.use("/company", companyRouter);

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const citizens = await processQuery("SELECT * FROM `citizens` WHERE `user_id` = ?", [req.user?.id]);

  return res.json({ status: "success", citizens });
});

router.get("/all", useAuth, async (_, res: Response) => {
  const citizens = await processQuery("SELECT `id`, `full_name` FROM `citizens`");

  return res.json({ citizens, status: "success" });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const {
    full_name,
    gender,
    ethnicity,
    birth,
    hair_color,
    eye_color,
    address,
    height,
    weight,
    dmv,
    pilot_license,
    fire_license,
    ccw,
    phone_nr,
  } = req.body;

  const file = req.files?.image ? (req.files.image as UploadedFile) : null;
  const index = req.files?.image && file?.name.indexOf(".");

  if (file && !SupportedFileTypes.includes(String(file.mimetype))) {
    return res.json({
      status: "error",
      error: `Image type is not supported, supported: ${SupportedFileTypes.join(", ")}`,
    });
  }

  const imageId = file ? `${uuidv4()}${file.name.slice(index)}` : "default.svg";

  if (full_name && birth && gender && ethnicity && hair_color && eye_color && height && weight) {
    const citizen = await processQuery("SELECT * FROM `citizens` WHERE `full_name` = ?", [full_name]);

    if (citizen[0]) {
      return res.json({
        status: "error",
        error: "Name is already in use!",
      });
    }

    const query =
      "INSERT INTO `citizens` (`id`, `full_name`, `user_id`, `birth`, `gender`, `ethnicity`, `hair_color`, `eye_color`, `address`, `height`, `weight`, `dmv`, `fire_license`, `pilot_license`, `ccw`, `business`, `business_id`, `rank`, `vehicle_reg`, `posts`, `image_id`, `b_status`, `note`, `phone_nr`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const id = uuidv4();
    try {
      await processQuery(query, [
        id /* Id */,
        full_name /* full name */,
        req.user?.id /* user_id */,
        birth /* birth */,
        gender /* gender */,
        ethnicity /* ethnicity */,
        hair_color /* hair_color */,
        eye_color /* eye_color */,
        address /* address */,
        height /* height */,
        weight /* weight */,
        dmv /* dmv */,
        fire_license /* fire_license */,
        pilot_license /* pilot_license */,
        ccw /* ccw */,
        "none" /* business */,
        "" /* business_id */,
        "none" /* rank */,
        true /* vehicle_reg */,
        true /* posts */,
        imageId /* image_id */,
        "" /* b_status */,
        "" /* note */,
        phone_nr || "" /* phone_nr */,
      ]);
    } catch (e) {
      Logger.error("CREATE_CITIZEN_ERROR", e);
      return res.json({
        error: "An error occurred when creating your citizen",
        status: "error",
      });
    }

    file?.name &&
      file.mv("./public/citizen-images/" + imageId, (err: string) => {
        if (err) {
          Logger.error("MOVE_CITIZEN_IMAGE", err);
        }
      });

    return res.json({ status: "success", citizenId: id });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.put("/:citizenId", useAuth, async (req: IRequest, res: Response) => {
  const { citizenId } = req.params;
  const {
    full_name,
    gender,
    ethnicity,
    birth,
    hair_color,
    eye_color,
    address,
    height,
    weight,
    dmv,
    pilot_license,
    fire_license,
    ccw,
    phone_nr,
  } = req.body;

  const file = req.files?.image ? (req.files.image as UploadedFile) : null;
  const index = req.files?.image && file?.name.indexOf(".");

  if (file && !SupportedFileTypes.includes(String(file.mimetype))) {
    return res.json({
      status: "error",
      error: `Image type is not supported, supported: ${SupportedFileTypes.join(", ")}`,
    });
  }

  const imageId = file ? `${uuidv4()}${file.name.slice(index)}` : "default.svg";

  if (full_name && birth && gender && ethnicity && hair_color && eye_color && height && weight) {
    const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [citizenId]);

    if (!citizen[0]) {
      return res.json({
        error: "Citizen was not found",
        status: "error",
      });
    }

    const query =
      "UPDATE `citizens` SET `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair_color` = ?, `eye_color` = ?, `address` = ?, `height` = ?, `weight` = ?, `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ?, `phone_nr` = ? WHERE `id` = ?";

    try {
      await processQuery(query, [
        birth /* birth */,
        gender /* gender */,
        ethnicity /* ethnicity */,
        hair_color /* hair_color */,
        eye_color /* eye_color */,
        address /* address */,
        height /* height */,
        weight /* weight */,
        dmv /* dmv */,
        fire_license /* fire_license */,
        pilot_license /* pilot_license */,
        ccw /* ccw */,
        phone_nr /* phone number */,
        citizenId /* id */,
      ]);

      if (file) {
        await processQuery("UPDATE `citizens` SET `image_id` = ? WHERE `id` = ?", [imageId, citizenId]);
      }
    } catch (e) {
      Logger.error("CREATE_CITIZEN_ERROR", e);
      return res.json({
        error: "An error occurred when creating your citizen",
        status: "error",
      });
    }

    file?.name &&
      file.mv("./public/citizen-images/" + imageId, (err: string) => {
        if (err) {
          Logger.error("MOVE_CITIZEN_IMAGE", err);
        }
      });

    return res.json({ status: "success", citizenId: citizenId });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.post("/info", useAuth, async (req: IRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }

  const citizen = await processQuery<Citizen[]>("SELECT * FROM `citizens` WHERE `full_name` = ?", [name]);

  if (!citizen[0]) {
    return res.json({
      error: "Citizen not found",
      status: "error",
    });
  }

  if (citizen[0].user_id !== req.user?.id) {
    return res.json({
      error: "This citizen is not connected to your account",
      status: "error",
    });
  }

  const citizenId = citizen[0]?.id ?? "not_found";

  const arrestReports = await processQuery("SELECT * FROM `arrest_reports` WHERE `citizen_id` = ?", [citizenId]);
  const tickets = await processQuery("SELECT * FROM `leo_tickets` WHERE `citizen_id` = ?", [citizenId]);
  const warrants = await processQuery("SELECT * FROM `warrants` WHERE `citizen_id` = ?", [citizenId]);

  return res.json({ status: "success", tickets, warrants, arrestReports, citizenId });
});

router.post("/expungement-request/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  // The requested options to be removed
  const { warrants, arrest_reports, tickets } = req.body;

  const citizen = await processQuery<Citizen[]>("SELECT * FROM `citizens` WHERE `id` = ?", [id]);

  if (!citizen) {
    return res.json({
      error: "That citizen was not found",
      status: "error",
    });
  }

  await processQuery(
    "INSERT INTO `court_requests` (`id`, `warrants`, `arrest_reports`, `tickets`, `citizen_id`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)",
    [v4(), JSON.stringify(warrants), JSON.stringify(arrest_reports), JSON.stringify(tickets), id, req.user?.id],
  );

  return res.json({
    status: "success",
  });
});

router.get("/expungement-requests", useAuth, async (req: IRequest, res: Response) => {
  const requests = await processQuery("SELECT * FROM `court_requests` WHERE `user_id` = ?", [req.user?.id]);

  return res.json({
    status: "success",
    requests: requests.map((re: any) => {
      re.warrants = JSON.parse(re.warrants);
      re.arrestReports = JSON.parse(re.arrest_reports);
      re.tickets = JSON.parse(re.tickets);
      return re;
    }),
  });
});

router.get("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [id]);

  return res.json({ citizen: citizen[0], status: "success" });
});

router.delete("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;

  await processQuery("DELETE FROM `citizens` WHERE `id` = ?", [id]);

  return res.json({ status: "success" });
});

router.put("/licenses/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { dmv, fire_license, pilot_license, ccw } = req.body;

  if (dmv && fire_license && pilot_license && ccw) {
    await processQuery(
      "UPDATE `citizens` SET `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ? WHERE `id` = ?",
      [dmv, fire_license, pilot_license, ccw, id],
    );

    return res.json({ status: "success", citizenId: id });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

export default router;
