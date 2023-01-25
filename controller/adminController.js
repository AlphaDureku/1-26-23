const mail = require('nodemailer')
const doctor = require('../Models/Database_Queries/doctor_query')
const insert = require('../Models/Database_Queries/insert_query')
const patient = require('../Models/Database_Queries/patient_query')
const admin = require('../Models/Database_Queries/admin_query')
const bcrypt = require('bcrypt')
const moment = require('moment')
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

exports.test = async(req, res) => {

    res.render('Secretary/Login', { layout: 'layouts/secretary_layout' })
}



exports.login = async(req, res) => {
    try {
        const result = await admin.findAdmin(req.body.username)
            // const salt = await bcrypt.genSalt()
            // const hashedPassword = await bcrypt.hash(req.body.password, salt)
        if (result == null) {
            res.send('Wrong username or password')
        }
        if (await bcrypt.compare(req.body.password, result.doctor_Secretary_password)) {
            req.session.sec_ID = result.doctor_Secretary_ID
            res.send('success')
        } else {
            res.send('Wrong username or password')
        }
    } catch (error) {
        console.log(error)
    }
}

exports.dashboard = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    const doctorList = await admin.findDoctors(req.session.sec_ID)
    console.log(doctorList)
    if (doctorList.length != 0) {
        req.session.doctor_ID = doctorList[0].doctor_ID
    } else {
        req.session.doctor_ID = null;
    }

    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.session.doctor_ID, startOfDay, endOfDay)

    res.render('Secretary/dashboard', {
        adminInfo: result,
        doctors: doctorList,
        appointments: patientAppointments,
        selection: '',
        layout: 'layouts/secretary_dashboard_layout',
        doctor_IDselect: req.session.doctor_ID
    })
}

exports.dashboardOnChange = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    const doctorList = await admin.findDoctors(req.session.sec_ID)
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    console.log(req.query.value)
    let options = {
        Day: '',
        Week: '',
        Month: '',
        Year: ''
    }
    doctor_IDselect = req.query.doctor_ID
    req.session.doctor_ID = req.query.doctor_ID

    if (req.query.nameQuery) {
        console.log('executed with name')
        if (req.query.value == 'thisDay') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfDay, endOfDay, req.query.nameQuery)
            options.Day = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else if (req.query.value == 'thisWeek') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfWeek, endOfWeek, req.query.nameQuery)
            options.Week = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else if (req.query.value == 'thisMonth') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfMonth, endOfMonth, req.query.nameQuery)
            options.Month = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else {
            const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfYear, endOfYear, req.query.nameQuery)
            options.Year = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        }
    } else {
        console.log('noname')
        if (req.query.value == 'thisDay') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.query.doctor_ID, startOfDay, endOfDay)
            options.Day = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else if (req.query.value == 'thisWeek') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.query.doctor_ID, startOfWeek, endOfWeek)
            options.Week = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else if (req.query.value == 'thisMonth') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.query.doctor_ID, startOfMonth, endOfMonth)
            options.Month = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else {
            const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.query.doctor_ID, startOfYear, endOfYear)
            options.Year = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        }
    }
}

exports.manageAppointments = async(req, res) => {
    const doctorList = await admin.findDoctors(req.session.sec_ID)
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();


    if (req.query.doctor_ID) {
        doctor_IDselect = req.query.doctor_ID
        req.session.doctor_ID = req.query.doctor_ID
    } else if (doctorList[0]) {
        doctor_IDselect = doctorList[0].doctor_ID
    } else {
        doctor_IDselect = ''
    }

    if (req.query.nameQuery) {
        const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfYear, endOfYear, req.query.nameQuery)
        res.render('Secretary/manageAppointments', { doctor_IDselect, doctors: doctorList, appointments: patientAppointments, adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
    } else {
        const patientAppointments = await doctor.fetchDoctorPatientAppointments(doctor_IDselect, startOfYear, endOfYear)
        res.render('Secretary/manageAppointments', { doctor_IDselect, doctors: doctorList, appointments: patientAppointments, adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
    }
}

exports.manageAppointmentList = async(req, res) => {
    if (req.query.date) {
        const patientAppointments = await doctor.fetchDoctorPatientAppointmentsThatDate(req.session.doctor_ID, req.query.date)
        res.send(patientAppointments)
    }
    res.end()
}
exports.notifyDoctorOnAppointment = async(req, res) => {
    try {
        const email = await doctor.getDoctorContact(req.body.doctor_ID)
        const appointmentsTodayWith = await admin.getAppointmentsToday(req.body.doctor_ID, req.body.date)
        console.log(appointmentsTodayWith)
        notifyDoctor(email.email, appointmentsTodayWith)
        res.end()
    } catch (err) {
        res.send('error')
    }

}
exports.notifyPatientsOnAppointment = async(req, res) => {
    if (req.body.date) {
        const phoneNumbers = [];
        const messageBody = [];
        const patientAppointments = await doctor.fetchDoctorPatientAppointmentsThatDate(req.session.doctor_ID, req.body.date)
        patientAppointments.forEach(patient => {
            let message = `Good Day ${patient.patient_Fname}, Manila Medical Center would like to remind you of your appointment for today at ${patient.start} to ${patient.end}`
            phoneNumbers.push(patient.contact)
            messageBody.push(message)
        })
        sendbulkSMS(phoneNumbers, messageBody)
        res.send('success')
    } else {
        res.send('error')
    }
}

exports.notifyPatientOnLate = async(req, res) => {
    if (req.body.date) {
        const phoneNumbers = [];
        const messageBody = [];
        const patientAppointments = await doctor.fetchDoctorPatientAppointmentsThatDate(req.session.doctor_ID, req.body.date)
        patientAppointments.forEach(patient => {
            let message = `Good Day ${patient.patient_Fname}, We would like to notify you that the doctor will be running late, please bear with us`
            phoneNumbers.push(patient.contact)
            messageBody.push(message)
        })
        sendbulkSMS(phoneNumbers, messageBody)
        res.send('success')
    } else {
        res.send('error')
    }
}



exports.get_SetAppointment = async(req, res) => {
    const result = await admin.get_SetAppointment(req.query.Dates, req.session.doctor_ID)
    console.log(result)
    res.send(result)
}


exports.manageProfile = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    res.render('Secretary/manageProfile', { adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
}
exports.updateProfile = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    res.render('Secretary/updateProfile', { adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
}
exports.updateProfilePost = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    let status = {
        Fname: true,
        Mname: true,
        Lname: true
    }
    const params = {
        ID: req.session.sec_ID,
        Fname: req.body.Fname,
        Mname: req.body.Mname,
        Lname: req.body.Lname
    }
    if (params.Fname == result.doctor_Secretary_first_name) {
        status.Fname = false
    }
    if (params.Lname == result.doctor_Secretary_last_name) {
        status.Lname = false
    }
    if (params.Mname == result.doctor_Secretary_middle_name) {
        status.Mname = false
    }
    if (status.Fname && status.Mname && status.Lname) {
        await admin.updateProfile(params)
    }

    res.send(status)

}
exports.updateSecurity = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    res.render('Secretary/updateSecurity', { adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
}
exports.updateSecurityPost = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)
    const params = {
        doctor_Secretary_ID: req.session.sec_ID,
        password: hashedPassword,
        newPassword: req.body.newPassword,
        retypePassword: req.body.retypePassword
    }

    const status = {
        isAuthorized: false,
        isSame: false
    }
    if (await bcrypt.compare(req.body.currentPassword, result.doctor_Secretary_password)) {
        status.isAuthorized = true
        if (params.newPassword == params.retypePassword) {
            status.isSame = true
            console.log('success')
            await admin.updatePassword(params)
            res.send(status)
        } else {
            res.send(status)
        }
    } else {
        res.send(status)
    }
}

exports.renderSchedule = async(req, res) => {
    console.log(req.session.doctor_ID)
    const result = await doctor.getOneDoctor3(req.session.doctor_ID)
    res.send(result)
}




exports.insertAdmin = async(req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash('1234', salt)
        let adminModel = {
            username: 'james',
            password: hashedPassword,
            Fname: 'James',
            Lname: 'Templanza',
        }
        insert.insertAdmin(adminModel)

        res.send('Successful')
    } catch (error) {
        console.log(error)
    }
}

exports.insertDoctorAvailability = async(req, res) => {
    const scheduleParams = {
        doctor_schedule_ID: req.body.doctor_schedule_ID,
        doctor_ID: req.session.doctor_ID,
        Interval: req.body.timeInterval,
        maxPatient: req.body.maxPatient,
        date: req.body.dateSelected,
        start: req.body.startTime,
        end: req.body.endTime,
    }
    console.log(scheduleParams)
    if (req.body.button == 'set') {
        insert.insertDoctorAvailability(scheduleParams)
        res.redirect('dashboard')
    } else {
        insert.updateDoctorAvailability(scheduleParams)
        res.redirect('dashboard')
    }
}

exports.updateAppointment = async(req, res) => {
    const params = {
        ID: req.body.appointment_ID,
        status: req.body.status
    }
    await admin.updateAppointment(params)
        //sendEmail
    const result = await patient.getAppointmentEmail(params.ID)
    const appointmentInfo = await patient.getappointmentDetails(params.ID)
    const contact = await admin.getContactUsingApp_ID(params.ID)
    let text = ''
    if (params.status == 'Confirmed') {
        text = `Hi, ${appointmentInfo.patient_first_name}
        Your appointment request is now confirmed. We will be expecting you at the hospital on ${appointmentInfo.date}, ${appointmentInfo.start} - ${appointmentInfo.end}. 
        Thank you for choosing Medical Manila Center.
        Regards, 
         Medical Manila Center
        `
        sendUpdate(result[0].email, text)
        sendSMS(contact.contact, text)
    } else if (params.status == 'Cancelled' || params.status == 'Rejected') {
        text = `Hi, ${appointmentInfo.patient_first_name}

        Your appointment on ${appointmentInfo.date}, ${appointmentInfo.start} to ${appointmentInfo.end} has been cancelled. We deeply apologize for the inconvenience. Kindly call this 0239-139 to reschedule your appointment.
        
        Please be noted that your rescheduled appointment will be in our priority.
        Thank you for understanding.
        
        
        Regards, 
        Medical Manila Center`
        sendUpdate(result[0].email, text)
        sendSMS(contact.contact, text)
    }
    //sendContact




    res.redirect('dashboard')
}

const sendUpdate = (email, status) => {
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
            subject: "Appointment Status", // Subject line
            html: `${status}`
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch(console.error);
}

const notifyDoctor = (email, table) => {
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
        let data_table = ''
        table.forEach(data => {
            data_table += `<tr>
            <td align = 'center'>${data.Fname} ${data.Lname}</td>
            <td align = 'center'>${data.contact}</td>
            </tr>`
        })
        let info = await transporter.sendMail({
            from: '"templanzamark2002@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Today's Schedule", // Subject line
            html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href=""style="font-size:1.5em;color: #388440;text-decoration:none;font-weight:600"><img src="https://scontent.fmnl17-3.fna.fbcdn.net/v/t1.15752-9/321282456_908070283943854_1271014493095011954_n.png?_nc_cat=106&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeHdk_yZVzdF2ZCQB-1B_lpPSb9wAsoUOl5Jv3ACyhQ6XqCVXQg6D1G3FWoJx8JJmsS6ACIxbWFiA2lmbxnil45B&_nc_ohc=WLr-Q7QHgd4AX_-qlmi&_nc_ht=scontent.fmnl17-3.fna&oh=03_AdRi-PF6HsHusKuwNJo0tlOOJ8KpiTvs_2b-0XZr9qX73A&oe=63E23A24" width="28" 
               height="25"/> Medical Center Manila</a>
              </div>
              <p style="font-size:1.7em;"><b>Hi,</b></p>
              <p>Here are the patient appointments for<b>${table[0].appointmentDate}</b> at<b> ${table[0].start} - ${table[0].end} </b></p>
              <style>
          table, th, td {
            border:1px solid black;
            text-align: center;
          }
          </style>
          <body>
          
          <table style="width:100%" border="2">
          <tr>
          <th>Full Name</th><th>Contact Number</th>
          <tr>
          ${data_table}

                
          </table>
              <p style="font-size:0.9em; padding:30px 0;">Regards,<br /><b>Ella Smith</b></p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
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


async function sendSMS(contact, message) {
    try {
        await client.messages.create({
            to: contact,
            messagingServiceSid: 'MGf7fbaf6d8edab1a80fd7fbdfcaf7ea0b',
            body: message
        });
        console.log(`Text message sent to ${to}`);
    } catch (error) {
        console.error(error);
    }
}

async function sendbulkSMS(phoneNumbers, messageBody) {
    for (let i = 0; i < phoneNumbers.length; i++) {
        try {
            const message = await client.messages.create({
                body: messageBody[i],
                from: 'MGf7fbaf6d8edab1a80fd7fbdfcaf7ea0b',
                to: phoneNumbers[i]
            });
            console.log(`Sent message to ${phoneNumbers}`);
        } catch (err) {
            console.log(err);
        }

    }
}