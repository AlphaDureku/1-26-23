const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');



router.get('/clinic', bookController.createPatientModel, bookController.renderClinicPage)
router.get('/outpatient', bookController.createPatientModel, bookController.renderOutpatientPage)
router.get('/patient-forms', bookController.renderPatientForm)
router.post('/send-otp', bookController.generateOTP, bookController.sendOTP)
router.post('/verify-otp', bookController.compareOTP)
router.post('/set-patientRecord', bookController.userExists)
router.post('/getPatient-Info', bookController.getPatientInfo)
router.get('/choose-doctor', bookController.renderDoctorList)
router.get('/search-doctor', bookController.searchDoctor)
router.get('/Finish', bookController.FinalStep)
router.get('/choose-schedule', bookController.chooseSchedule)
router.get('/get-schedule', bookController.renderSchedule)
router.get('/get-schedule2', bookController.renderSchedule2)
router.get('/get-receipt', bookController.getReceipt)
router.post('/set-appointment', bookController.setAppointment)
module.exports = router;