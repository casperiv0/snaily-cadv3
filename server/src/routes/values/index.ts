import { Router } from "express";

import ethnicityRouter from "./ethnicities";
import genderRouter from "./genders";
import legalStatusRouter from "./legal-statuses";
import weaponRouter from "./weapons";

const router: Router = Router();

router.use("/genders", genderRouter);
router.use("/ethnicities", ethnicityRouter);
router.use("/legal-statuses", legalStatusRouter);
router.use("/weapons", weaponRouter);

export default router;
