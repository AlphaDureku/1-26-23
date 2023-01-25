const patient = require('../Models/Database_Queries/patient_query')
const Title = require('../Models/Object_Models/Title')

exports.fetch_User_Patients = async(req, res) => {
    const result = await patient.fetch_User_Patients(req.params.id)
    console.log(result)
    res.render('Patient/Manage-Patients', { queriedPatients: result, layout: 'layouts/sub', Title: Title.TrackMe })
}


exports.fetchPatient_Appointments_Using_Patient_ID = async(req, res) => {
    const result = await patient.fetchPatient_Appointments_Using_Patient_ID(req.params.id)
    console.log(result)
    res.render('Patient/Appointments', { queriedAppointments: result, layout: 'layouts/sub', Title: Title.MyAppointments })
}

exports.editPatientInfo_Using_Patient_ID = async(req, res) => {
    req.session.patient_ID = req.params.id
    const result = await patient.fetch_Patient_Info_Using_Patient_ID(req.params.id)
    res.render('Patient/Edit-Info', { result: result, layout: 'layouts/sub', Title: 'Edit Patient Information' })
}

exports.getnewPatientInfo = async(req, res) => {
    let patientModel = {
        patient_ID: req.session.patient_ID,
        Fname: req.body.Fname,
        Mname: req.body.Mname,
        Lname: req.body.Lname,
        birth: req.body.birth,
        address: req.body.address,
        contact: req.body.contact
    }
    await patient.updatePatientInfo(patientModel)
    console.log(patientModel)
}