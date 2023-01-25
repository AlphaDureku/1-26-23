const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController')

router.get('/', adminController.test)
router.post('/login', adminController.login)
router.get('/dashboard', adminController.dashboard)
router.get('/dashboard-change', adminController.dashboardOnChange)
router.get('/manage-profile', adminController.manageProfile)
router.get('/update-profile', adminController.updateProfile)
router.post('/update-profile', adminController.updateProfilePost)
router.get('/update-security', adminController.updateSecurity)
router.post('/update-security', adminController.updateSecurityPost)
router.get('/get-calendar', adminController.renderSchedule)
router.post('/set-schedule', adminController.insertDoctorAvailability)
router.post('/update-appointment', adminController.updateAppointment)
router.get('/manage-appointments', adminController.manageAppointments)
router.get('/get-appointment-list', adminController.manageAppointmentList)
router.post('/notify-doctor', adminController.notifyDoctorOnAppointment)
router.post('/notify-patient', adminController.notifyPatientsOnAppointment)
router.post('/notify-patient2', adminController.notifyPatientOnLate)
router.get('/get_Set-Appointment', adminController.get_SetAppointment)
module.exports = router;