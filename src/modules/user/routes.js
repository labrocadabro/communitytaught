import express from "express";

import * as user from "./controllers.js";

const router = express.Router();

router.get("/dashboard", user.dashboard);
router.get("/settings", user.account);
router.get("/account", user.settings);

export default router;
