import express from 'express';

import * as email from '../controllers/email.js';

const router = express.Router();

router.get('/verify', email.verify);
router.post('/forgot', email.forgot);


export default router;