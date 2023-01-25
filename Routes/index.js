const express = require('express');
const router = express.Router();
const searchController = require('../controller/searchController');
const trackAppointmentController = require('../controller/trackAppointmentController')
const setupController = require('../controller/setupController')



router.get('/', searchController.renderHomePage)

router.get('/setup-hmo', setupController.setupHMO)

router.get('/setup-specialization', setupController.setup_Specialization)

router.get('/doctors-directory', searchController.renderDoctorsDirectory)

router.get('/user-directory', trackAppointmentController.renderUserDirectory)

router.post('/send-OTP', trackAppointmentController.sendEmailOtp)

router.post('/verify', trackAppointmentController.fetchPatient_OTP)

router.post('/insert', trackAppointmentController.insert)

module.exports = router;