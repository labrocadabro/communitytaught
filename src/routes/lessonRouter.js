import express from 'express';

import * as lessons from '../controllers/lessons.js';

const router = express.Router();

router.get('/add', lessons.addLessonForm);
router.post('/add', lessons.addLesson);

export default router;