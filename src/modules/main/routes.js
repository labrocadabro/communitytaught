import express from "express";

import * as main from "./controllers.js";

const router = express.Router();

router.get("/", main.index);
router.get("/about", main.about);

router.get("/resources", main.resources);
router.get("/resources/:page", main.resourcePage);

export default router;
