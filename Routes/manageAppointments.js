const express = require('express');
const router = express.Router();
const patientController = require('../controller/patientController')

router.get('/:id', patientController.fetch_User_Patients)
router.get('/my-appointments/:id', patientController.fetchPatient_Appointments_Using_Patient_ID)
router.get('/Edit-Patient/:id', patientController.editPatientInfo_Using_Patient_ID)
router.post('/update-patient', patientController.getnewPatientInfo)


module.exports = router;