import express from 'express';

import * as homework from '../controllers/homework.js';

const router = express.Router();

router.get('/add', homework.addEditHomeworkForm);
router.get('/edit/:id', homework.addEditHomeworkForm);
router.post('/add', homework.addEditHomework);
router.post('/edit/:id', homework.addEditHomework);

router.post('/import', homework.importData);

router.get('/all', homework.showHomework);

router.put('/item/:id', homework.toggleItem); 
router.put('/extra/:id', homework.toggleExtra); 
router.put('/submit/:id', homework.toggleSubmitted); 

export default router;