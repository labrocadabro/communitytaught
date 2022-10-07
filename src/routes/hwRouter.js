import express from 'express';

import * as homework from '../controllers/homework.js';

const router = express.Router();

router.get('/add', homework.addHomework);

export default router;