import express from 'express';

import * as homework from '../controllers/homework.js';

const router = express.Router();

router.get('/add', homework.addEditHomeworkForm);
router.get('/edit/:id', homework.addEditHomeworkForm);
router.post('/add', homework.addEditHomework);
router.post('/edit/:id', homework.addEditHomework);

router.get('/all', homework.showHomework);

router.put('/item/:itemId/:hwId', homework.toggleItem); 
router.put('/extra/:itemId/:hwId', homework.toggleExtra); 


export default router;