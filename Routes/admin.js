const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController')

router.get('/', adminController.test)
router.post('/login', adminController.login)
router.get('/dashboard', adminController.checkSession, adminController.dashboard)
router.get('/dashboard-change', adminController.checkSession, adminController.dashboardOnChange)
router.get('/manage-profile', adminController.checkSession, adminController.manageProfile)
router.get('/update-profile', adminController.checkSession, adminController.updateProfile)
router.post('/update-profile', adminController.checkSession, adminController.updateProfilePost)
router.get('/update-security', adminController.checkSession, adminController.updateSecurity)
router.post('/update-security', adminController.checkSession, adminController.updateSecurityPost)
router.get('/get-calendar', adminController.checkSession, adminController.renderSchedule)
router.post('/set-schedule', adminController.checkSession, adminController.insertDoctorAvailability)
router.post('/update-appointment', adminController.checkSession, adminController.updateAppointment)
router.get('/manage-appointments', adminController.checkSession, adminController.manageAppointments)
router.get('/get-appointment-list', adminController.checkSession, adminController.manageAppointmentList)
router.post('/notify-doctor', adminController.checkSession, adminController.notifyDoctorOnAppointment)
router.post('/notify-patient', adminController.checkSession, adminController.notifyPatientsOnAppointment)
router.post('/notify-patient2', adminController.checkSession, adminController.notifyPatientOnLate)
router.get('/get_Set-Appointment', adminController.checkSession, adminController.get_SetAppointment)
module.exports = router;