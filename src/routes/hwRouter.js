import express from 'express';

import * as homework from '../controllers/homework.js';

const router = express.Router();

router.get('/add', homework.addHomeworkForm);
router.post('/add', homework.addHomework);

router.get('/all', homework.showHomework);

router.put('/item/:itemId/:hwId', homework.toggleItem); 
router.put('/extra/:itemId/:hwId', homework.toggleExtra); 


export default router;