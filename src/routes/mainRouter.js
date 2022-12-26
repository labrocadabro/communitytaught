import express from "express";

import * as pages from "../controllers/pages.js";
import * as auth from "../controllers/auth.js";

const router = express.Router();

router.get("/", pages.index);
router.get("/about", pages.about);
router.get("/dashboard", pages.dashboard);
router.get("/account", pages.account);

router.get("/register", pages.register);
router.get("/login", pages.login);
router.get("/forgot", pages.forgot);
router.get("/reset", pages.reset);
router.post("/change-password", auth.changePassword);
router.post("/set-password", auth.setPassword);
router.post("/change-email", auth.changeEmail);
router.delete("/delete-account", auth.deleteAccount);

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/reset", auth.reset);
router.get("/logout", auth.logout);

router.get("/verify", auth.verify);

router.get("/resources", pages.resources);
router.get("/resources/:page", pages.resourcePage);

export default router;
