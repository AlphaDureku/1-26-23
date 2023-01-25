const Title = require('../Models/Object_Models/Title')
const doctor = require('../Models/Database_Queries/doctor_query')
let DoctorParams = {
    firstName: "Yor",
    lastName: "Forger",
    specialization: "Waifu",
    sub_specialization: "Assassin",
    gender: "F",
    dateOfBirth: "1998-01-02",
    contact_number: "09984416526",
    HMO: "Blue Cross"
}


exports.renderHomePage = async(req, res) => {
    searchOption = ""

    res.render('home/index', { retainDoctorQuery: searchOption, Title: Title.Home })

}

exports.renderDoctorsDirectory = async(req, res) => {
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

        console.log(result)
        res.render('home/index', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, Title: Title.Home })
            //Using specs only
    } else if ((!searchOption.Fname && !searchOption.Lname) && (searchOption.Specialization != undefined && searchOption.doctor_HMO != undefined)) {
        console.log("get by spec and sub_spec only")
        const result = await doctor.getDoctor_Using_Spec_SubSpec_HMO(searchOption)
        const schedule = await doctor.getSchedule_Using_Spec_SubSpec_HMO(searchOption)
        console.log(result)
        res.render('home/index', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, Title: Title.Home })
    } else if ((searchOption.Fname != undefined || searchOption.Lname != undefined) && (searchOption.Specialization || searchOption.doctor_HMO)) {
        console.log("get by Name, spec and sub_spec")
        const result = await doctor.getDoctor_Using_All(searchOption);
        const schedule = await doctor.getSchedule_Using_All(searchOption)
        console.log(result)
        res.render('home/index', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, Title: Title.Home })
    } else if (searchOption.Fname && searchOption.Lname) {
        console.log("get by Fname Lname")
        const result = await doctor.getDoctor_Using_Fname_Lname(searchOption)
        const schedule = await doctor.getSchedule_Using_Fname_Lname(searchOption)
        console.log("get by Fname Lname")
        res.render('home/index', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, Title: Title.Home })
    } else if (searchOption.Lname) {
        console.log("get by LName")
        const result = await doctor.getDoctor_Using_Lname(searchOption)
        const schedule = await doctor.getSchedule_Using_Lname(searchOption)
        res.render('home/index', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, Title: Title.Home })
    } else if (searchOption.Fname) {
        console.log("get by FName")
        const result = await doctor.getDoctor_Using_Fname(searchOption)
        const schedule = await doctor.getSchedule_Using_Fname(searchOption)
        res.render('home/index', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, Title: Title.Home })
    } else {
        console.log("Undefined")
        res.render('home/index')
    }
}


//Not in use
exports.getProfile = async(req, res) => {
    const result = await doctor.getOneDoctor(req.params.id)
    res.render('Doctor/Profile', { queriedDoctors: result, layout: "layouts/sub", Title: Title.Home })
}