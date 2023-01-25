const verification = require('../Models/Database_Queries/verification_query')
const patient = require('../Models/Database_Queries/patient_query')
const doctor = require('../Models/Database_Queries/doctor_query')
const mail = require('nodemailer')
const insert = require('../Models/Database_Queries/insert_query')
const uuid = require('uuid')

let DoctorParams = [{
        firstName: "Squidward",
        lastName: "Tentacles",
        email: 'templanzamark2002@gmail.com',
        contact_number: "09659546446",
        room: 'ABC-205',
        gender: 'M',
        dateOfBirth: '2002-01-02',
        HMO_IDs: [2, 6, 8],
        specialization_ID: 4
    },
    {
        firstName: "Spongebob",
        lastName: "Squarepants",
        email: 'templanzamarktemp02@gmail.com',
        contact_number: "09984416526",
        room: 'ABC-206',
        gender: 'M',
        dateOfBirth: '1994-01-02',
        HMO_IDs: [2, 5, 7],
        specialization_ID: 1
    }, {
        firstName: "Eugene",
        lastName: "Crabs",
        email: 'mastemplanza2020@plm.edu.ph',
        contact_number: "09653876383",
        room: 'ABC-207',
        gender: 'M',
        dateOfBirth: '2000-01-02',
        HMO_IDs: [1, 2, 3],
        specialization_ID: 7
    }
]

const Department_List = [
    { department_Name: 'Department of Anesthesiology' },
    { department_Name: 'Department of Dental Medicine' },
    { department_Name: 'Department of Emergency Medicine' }
]




let ScheduleParams = [{
    date: "2023-01-22",
    start_time: "02:00:00",
    end_time: "06:00:00",
    total_patient: 4
}, {
    date: "2023-01-23",
    start_time: "01:00:00",
    end_time: "04:00:00",
    total_patient: 15
}, {
    date: "2023-01-25",
    start_time: "09:00:00",
    end_time: "01:00:00",
    total_patient: 10
}]

exports.insert = async(req, res) => {
    // insert.insertHmoList(HMO_List)
    // insert.insertSpecializationList(Specialization_List)
    // for (let i = 0; i < 4; i++) {
    //     insert.InsertDoctor(DoctorParams[i])
    // }
    // insert.InsertSchedule('MCM-29b0111a-d4ba-46da-93fe-6092ccd03928', ScheduleParams[0])
    // insert.InsertSchedule('MCM-49d8d4fa-4daf-4aae-a6c0-634273c6a3eb', ScheduleParams[1])
    // insert.InsertSchedule('MCM-64b28d1e-19a8-415e-a5f4-6964a3965a35', ScheduleParams[2])
    res.end()
}


//Check appointment section
exports.renderUserDirectory = async(req, res) => {
    // for (let i = 0; i < 3; i++) {
    //     insert.InsertDoctor(DoctorParams[i])
    // }
    //insert.InsertSchedule('MCM-2b5ba5b4-7cce-4453-b22a-a66014bb5a64', ScheduleParams[0])
    //insert.insert_user('templanzamark2002@gmail.com')
    const result = await patient.fetchUser_Directory()
    res.json(result)
}

exports.sendEmailOtp = async(req, res) => {
    const Patient = {
            Email: req.body.patient_Email
        }
        //To check if atleast 1 patient exists
    const result = await patient.fetchPatient_Appointments_Using_Email(Patient.Email)
    if (result.length !== 0) {
        const hashed = await verification.generateOTP(Patient.Email)
        sendEmail(Patient.Email, hashed)
    }
    res.end()
}

exports.fetchPatient_OTP = async(req, res) => {
    let user = {
        Email: req.body.inputEmail,
        user_ID: null,
        isVerified: false
    }
    const result = await verification.fetchPatient_OTP(user.Email)
    console.log(result)
    result.forEach(data => {
        if (data.user_OTP == req.body.inputOTP) {
            user.isVerified = true
            user.user_ID = data.user_ID
        }
    })
    if (user.isVerified)
        res.send({ isVerified: user.isVerified, user_ID: user.user_ID })
    else
        res.send({ isVerified: user.isVerified })
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
            from: '"templanzamark2002@gmail.com',
            to: email,
            subject: "Security Verification",
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
            </div>`,
        });
        console.log("Message sent: %s", info.messageId);

    }

    main().catch(console.error);
}