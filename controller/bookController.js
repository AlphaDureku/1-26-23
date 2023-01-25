const mail = require('nodemailer')
const doctor = require('../Models/Database_Queries/doctor_query')
const insert = require('../Models/Database_Queries/insert_query')
const patient = require('../Models/Database_Queries/patient_query')
const Title = require('../Models/Object_Models/Title')
const uuid = require('uuid');


exports.renderClinicPage = async(req, res) => {
    req.session.patientModel.appointmentType = "Clinic"
    req.session.UserPatients = null //resets UserPatientList
    req.session.user_ID = null
    res.render('Services/clinic', { layout: 'layouts/sub', Title: Title.Clinic })
}
exports.renderOutpatientPage = async(req, res) => {
    req.session.patientModel.appointmentType = "Outpatient"
    req.session.UserPatients = null
    req.session.user_ID = null
    res.render('Services/outpatient', { layout: 'layouts/sub', Title: Title.Outpatient })
}
exports.createPatientModel = function(req, res, next) {
    req.session.patientModel = {
        patientID: uuid.v4(),
        Fname: "",
        Mname: "",
        Lname: "",
        dateOfBirth: "",
        contactNumber: "",
        address: "",
        gender: "",
        appointmentType: "",
        doctor_schedule_ID: "",
    }
    req.session.patient_ID = ''
    next()
}


exports.sendOTP = async(req, res) => {
    sendEmail(req.session.Patient.Email, req.session.Patient.OTP)
    res.end()
}
exports.compareOTP = async(req, res) => {
    patient.findUserUsingEmail(req.session.Patient.Email)
    let Patient = {
        inputOTP: req.body.inputOTP,
        User_ID: '',
        isVerified: false,
        hasHistory: false,
        patientList: {}
    }
    req.session.user_ID = await patient.findUserUsingEmail(req.session.Patient.Email)
    Patient.User_ID = req.session.user_ID
    if (Patient.User_ID != null) {
        req.session.UserPatients = await patient.fetch_User_Patients(Patient.User_ID.user_ID)
    }
    if (req.session.UserPatients != null) {
        Patient.patientList = req.session.UserPatients
        Patient.hasHistory = true
    }
    if (Patient.inputOTP == /*req.session.Patient.OTP*/ 1) {
        Patient.isVerified = true
    }
    console.log(Patient)
    res.send(Patient)
}
exports.generateOTP = function(req, res, next) {
    const hashed = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    req.session.Patient = {
        Email: req.body.patient_Email,
        OTP: hashed
    }
    next()
}

exports.userExists = async(req, res) => {
    req.session.patient_ID = req.body.choice
    if (req.session.patient_ID != 'new') {
        res.redirect('choose-doctor')
    } else {
        res.render('Services/patient-forms', { layout: 'layouts/sub', Title: Title.PatientInformation })
    }

}

exports.renderPatientForm = async(req, res) => {
    if (req.session.user_ID != null) {
        console.log(req.session.UserPatients)
        res.render('go to page and ash if they wanted to use a patient registered with their email, if yes then save req.session.patient_ID, if no proceed to else')
    } else {
        console.log('new User or new Patient')
        res.render('Services/patient-forms', { layout: 'layouts/sub', Title: Title.PatientInformation })
    }
}
exports.getPatientInfo = async(req, res) => {
    req.session.patientModel.Fname = req.body.Fname
    req.session.patientModel.Lname = req.body.Lname
    req.session.patientModel.Mname = req.body.Mname
    req.session.patientModel.address = req.body.address
    req.session.patientModel.contactNumber = req.body.contactNumber
    req.session.patientModel.dateOfBirth = req.body.dateOfBirth
    req.session.patientModel.gender = req.body.gender
    res.redirect('choose-doctor')
}
exports.renderDoctorList = async(req, res) => {
    const result = await doctor.getDoctor()
    const schedule = await doctor.getSchedule()
    res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, layout: 'layouts/sub', Title: Title.ChooseDoctor })
}
exports.searchDoctor = async(req, res) => {
    let searchOption = {
        Fname: req.query.doctor_Fname,
        Lname: req.query.doctor_Lname,
        Specialization: req.query.specialization,
        doctor_HMO: req.query.doctor_HMO
    }
    console.log(searchOption.Fname)
        //ALL
    if (!searchOption.Fname && !searchOption.Lname && !searchOption.Specialization && !searchOption.doctor_HMO) {
        const result = await doctor.getDoctor()
        const schedule = await doctor.getSchedule()
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
            //Using specs only
    } else if ((!searchOption.Fname && !searchOption.Lname) && (searchOption.Specialization != undefined && searchOption.doctor_HMO != undefined)) {
        console.log("get by spec and sub_spec only")
        const result = await doctor.getDoctor_Using_Spec_SubSpec_HMO(searchOption)
        const schedule = await doctor.getSchedule_Using_Spec_SubSpec_HMO(searchOption)
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else if ((searchOption.Fname != undefined || searchOption.Lname != undefined) && (searchOption.Specialization || searchOption.doctor_HMO)) {
        console.log("get by Name, spec and sub_spec")
        const result = await doctor.getDoctor_Using_All(searchOption);
        const schedule = await doctor.getSchedule_Using_All(searchOption)
        console.log(result)
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else if (searchOption.Fname && searchOption.Lname) {
        console.log("get by Fname Lname")
        const result = await doctor.getDoctor_Using_Fname_Lname(searchOption)
        const schedule = await doctor.getSchedule_Using_Fname_Lname(searchOption)
        console.log("get by Fname Lname")
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else if (searchOption.Lname) {
        console.log("get by LName")
        const result = await doctor.getDoctor_Using_Lname(searchOption)
        const schedule = await doctor.getSchedule_Using_Lname(searchOption)
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else if (searchOption.Fname) {
        console.log("get by FName")
        const result = await doctor.getDoctor_Using_Fname(searchOption)
        const schedule = await doctor.getSchedule_Using_Fname(searchOption)
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else {
        console.log("Undefined")
        res.render('Services/choose-doctor')
    }

}
exports.renderSchedule = async(req, res) => {
    const result = await doctor.getOneDoctor(req.session.doctor)
    res.send(result)
}
exports.renderSchedule2 = async(req, res) => {
    const result = await doctor.getOneDoctor2(req.session.doctor)
    res.send(result)
}
exports.chooseSchedule = async(req, res) => {
    req.session.doctor = req.query.doctor
    res.render('Services/choose-schedule', { layout: 'layouts/sub', Title: 'Choose Schedule' })
}

exports.getReceipt = async(req, res) => {
    req.session.patientModel.doctor_schedule_ID = req.query.doctor_schedule_ID
    const result = await patient.getReceipt(req.query.doctor_schedule_ID)
    console.log(result)
    if (req.session.patient_ID != undefined && req.session.patient_ID != '') {
        const checkIfConflict = await doctor.checkIfConflict(req.session.patient_ID, result[0].date)
        console.log(checkIfConflict)
        console.log(checkIfConflict.length)
        if (checkIfConflict.length == 0) {
            res.send(result[0])
        } else {
            console.log('may conflict')
            res.send('error')
        }
    } else {
        res.send(result[0])
    }

}

exports.setAppointment = async(req, res) => {
    const queue_number = await doctor.getQueueInstance(req.body.doctor_schedule_id)

    if (req.session.user_ID == null) {
        req.session.user_ID = await insert.insert_user(req.session.Patient.Email)
    }
    if (req.session.patient_ID == undefined || req.session.patient_ID == '') {
        patientParams = {
            user_ID: req.session.user_ID.user_ID,
            Fname: req.session.patientModel.Fname,
            Lname: req.session.patientModel.Lname,
            Mname: req.session.patientModel.Mname,
            birth: req.session.patientModel.dateOfBirth,
            address: req.session.patientModel.address,
            gender: req.session.patientModel.gender,
            contact: req.session.patientModel.contactNumber
        }

        console.log('INSERTPATIENT HAHAHAHAHA')
        req.session.patient_ID = await insert.insertPatient(patientParams)
        console.log(req.session.patient_ID)
    }
    console.log('NO INSERT HAHAHAHAHA')
    appointmentParams = {
        patient_ID: req.session.patient_ID,
        doctorSchedule_ID: req.body.doctor_schedule_id,
        start: req.body.start,
        doctor_ID: req.session.doctor,
        queue: queue_number,
        type: req.session.patientModel.appointmentType
    }
    console.log(appointmentParams)
    req.session.appointment_ID = await insert.insertAppointmentDetails(appointmentParams)
    doctor.incrementQueue(appointmentParams.doctorSchedule_ID)
    res.end()
}


exports.FinalStep = async(req, res) => {
    const result = await patient.getappointmentDetails(req.session.appointment_ID)
    console.log(result)
    res.render('Services/Last-step', { final: result, layout: 'layouts/sub', Title: 'Finishing' })
}

// Send Email Process
const sendEmail = (email, otp) => {
    async function main() {
        let testAccount = await mail.createTestAccount();
        let transporter = mail.createTransport({
            service: 'gmail',
            secure: false,
            auth: {
                user: 'templanzamark2002@gmail.com',
                pass: 'koaowdqdigdcujwr',
            },
        });
        let info = await transporter.sendMail({
            from: '"templanzamark2002@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Security Verification", // Subject line
            html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src='https://scontent.fmnl17-3.fna.fbcdn.net/v/t1.15752-9/321282456_908070283943854_1271014493095011954_n.png?_nc_cat=106&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeHdk_yZVzdF2ZCQB-1B_lpPSb9wAsoUOl5Jv3ACyhQ6XqCVXQg6D1G3FWoJx8JJmsS6ACIxbWFiA2lmbxnil45B&_nc_ohc=WLr-Q7QHgd4AX_-qlmi&_nc_ht=scontent.fmnl17-3.fna&oh=03_AdRi-PF6HsHusKuwNJo0tlOOJ8KpiTvs_2b-0XZr9qX73A&oe=63E23A24' width='28' 
                 height='25'/> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p><b>Dont share this code to anyone.</b> </p>
                <p>Thank you for choosing Medical Center Manila, Your will see below your OTP number. </p>
                <h2 style='background: #2F9D44; margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${otp}</h2>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>1002 PLM General luna</p>
                  <p>Manila</p>
                </div>
              </div>
            </div>`
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch(console.error);
}