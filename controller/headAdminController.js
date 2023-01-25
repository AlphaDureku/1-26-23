const mail = require('nodemailer')
const doctor = require('../Models/Database_Queries/doctor_query')
const insert = require('../Models/Database_Queries/insert_query')
const patient = require('../Models/Database_Queries/patient_query')
const head = require('../Models/Database_Queries/headAdmin_Query')
const setup = require('../Models/Database_Queries/setup_query')
const bcrypt = require('bcrypt')
const Title = require('../Models/Object_Models/Title')
const uuid = require('uuid');


exports.index = async(req, res) => {

    res.render('headAdmin/index', { layout: 'layouts/headAdmin_layout', Title: 'Head Administrator' })
}


exports.authorization = async(req, res) => {
    const result = await head.AuthorizeAdmin(req.body.username)
    try {
        if (req.body.username === result.head_Manager_username && req.body.password === result.head_Manager_password) {
            req.session.headAdmin_ID = result.head_Manager_ID
            console.log(req.session.headAdmin_ID)
            res.send('success')
        } else {
            res.send('failed')
        }
    } catch {
        res.send('failed')
    }

}



exports.dashboard = async(req, res) => {
    const result = await head.getHeadAdmin(req.session.headAdmin_ID)
    const doctorListWithoutNurse = await head.getDoctorWithoutNurse()
    const doctorListWithNurse = await head.getDoctorWithNurse()
    const nurses = await head.getNurses()
    const special = await setup.setup_Specialization()
    const hmo = await setup.setup_HMO()
    console.log(nurses)
    res.render('headAdmin/dashboard', { adminInfo: result, noNurse: doctorListWithoutNurse, withNurse: doctorListWithNurse, nurseList: nurses, spe: special, hmo: hmo, layout: 'layouts/headAdmin_dashboard_layout', Title: 'Head Administrator' })
}

exports.withSearchDashboard = async(req, res) => {
    const result = await head.getHeadAdmin(req.session.headAdmin_ID)
    const doctorListWithoutNurse = await head.getDoctorWithoutNurseWithSearch(req.query.doctorSearchInput)
    console.log(doctorListWithoutNurse)
    const doctorListWithNurse = await head.getDoctorWithNurse()
    const nurses = await head.getNurses()
    const special = await setup.setup_Specialization()
    const hmo = await setup.setup_HMO()
    res.render('headAdmin/dashboard', { adminInfo: result, noNurse: doctorListWithoutNurse, withNurse: doctorListWithNurse, nurseList: nurses, spe: special, hmo: hmo, layout: 'layouts/headAdmin_dashboard_layout', Title: 'Head Administrator' })
}


exports.match = async(req, res) => {
    await head.match(req.body.doctorPair, req.body.nursePair)
    setTimeout(() => {
        res.redirect('dashboard')
    }, 1500);

}


exports.updateMatch = async(req, res) => {
    await head.match(req.body.doctor_ID, req.body.nurse_ID)
    setTimeout(() => {
        res.redirect('dashboard')
    }, 1500);
}

exports.removeDoctor = async(req, res) => {
    await head.removeDoctor(req.body.doctor_ID)
    setTimeout(() => {
        res.redirect('dashboard')
    }, 1500);
}

const HMO_List = [
    { HMO_Name: 'Flexicare' },
    { HMO_Name: 'Intellicare' },
    { HMO_Name: 'Kaiser International' },
    { HMO_Name: 'Healthgroup Inc.' },
    { HMO_Name: 'Lacson and Lacson Ins.' },
    { HMO_Name: 'Brokers Inc.' },
    { HMO_Name: 'Maxicare' },
    { HMO_Name: 'Med-Asia Phils.' },
    { HMO_Name: 'Amusement and Gaming Corporation' },
    { HMO_Name: 'Valuecare' },
    { HMO_Name: 'PhilCare' },
    { HMO_Name: 'Medocare' },
]

const Specialization_List = [
    { specialization_Name: 'Cardiology' },
    { specialization_Name: 'Psychiatrist' },
    { specialization_Name: 'Oncology' },
    { specialization_Name: 'Neurology' },
    { specialization_Name: 'Dermatology' },
    { specialization_Name: 'Internal Medicine' },
    { specialization_Name: 'Nephrology' },
    { specialization_Name: 'General Surgery' }
]

exports.insertheadAdmin = async(req, res) => {
    const params = {
        Fname: 'Admin',
        Lname: 'Moderator',
        username: 'admin',
        password: 'admin',
    }
    insert.insertHmoList(HMO_List)
    insert.insertSpecializationList(Specialization_List)
    insert.insertHeadManager(params)

}

exports.insertDoctor = async(req, res) => {
    let params = {
        firstName: req.body.doctor_Fname,
        lastName: req.body.doctor_Lname,
        gender: req.body.gender,
        email: req.body.email,
        dateOfBirth: req.body.dateOfbirth,
        contact_number: req.body.contact,
        room: req.body.room,
        specialization_ID: req.body.specialization,
    }
    console.log(params)
    insert.InsertDoctor(params, req.body.hmo)

    res.redirect('dashboard')
}

exports.insertAdmin = async(req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        let adminModel = {
            username: req.body.username,
            password: hashedPassword,
            Fname: req.body.Fname,
            Lname: req.body.Lname,
        }

        insert.insertAdmin(adminModel)
        res.redirect('dashboard')
    } catch (error) {
        console.log(error)
    }
}


exports.checkSession = function(req, res, next) {
    if (!req.session.headAdmin_ID) {
        return res.status(401).send({ error: 'Unauthorized, Your session has expired. Please re-login' });
    }
    next();
}