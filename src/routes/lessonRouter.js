import express from 'express';

import * as lessons from '../controllers/lessons.js';

const router = express.Router();

router.get('/add', lessons.addLessonForm);
router.post('/add', lessons.addLesson);

router.get('/all', lessons.allLessons);
router.get('/:permalink', lessons.showLesson); 

export default router;