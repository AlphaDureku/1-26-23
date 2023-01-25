const express = require('express');
const router = express.Router();
const headAdmin = require('../controller/headAdminController');

router.get('/', headAdmin.index)
router.get('/insert', headAdmin.insertheadAdmin)
router.get('/dashboard', headAdmin.checkSession, headAdmin.dashboard)
router.get('/searchDoctor', headAdmin.checkSession, headAdmin.withSearchDashboard)
router.post('/authorize', headAdmin.authorization)
router.post('/match', headAdmin.checkSession, headAdmin.match)
router.post('/removeDoctor', headAdmin.checkSession, headAdmin.removeDoctor)
router.post('/addDoctor', headAdmin.checkSession, headAdmin.insertDoctor)
router.post('/addSec', headAdmin.checkSession, headAdmin.insertAdmin)
module.exports = router;