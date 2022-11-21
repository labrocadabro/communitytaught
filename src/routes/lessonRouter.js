import express from "express";

import * as lessons from "../controllers/lessons.js";

const router = express.Router();

router.get("/add", lessons.addEditLessonForm);
router.get("/edit/:id", lessons.addEditLessonForm);
router.get("/delete/:id", lessons.deleteLesson);
router.post("/add", lessons.addEditLesson);
router.post("/edit/:id", lessons.addEditLesson);

router.get("/all", lessons.allLessons);
router.get("/:permalink", lessons.showLesson);

router.put("/watched/:id", lessons.toggleWatched);
router.put("/checkedin/:id", lessons.toggleCheckedIn);

export default router;
