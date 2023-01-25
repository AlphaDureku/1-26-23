const model = require('../sequelize_sequelizeModel')
const uuid = require('uuid')
const Sequelize = require('sequelize')
const { incrementQueue } = require('./doctor_query')


async function saveQuery(table) {
    try {
        return await table.save()
    } catch (err) {
        console.log(err)
    }
}


exports.insert_user = async function(email) {
    const userModel = {
        user_ID: "USER-" + uuid.v4(),
        user_email: email,
    }
    const newUser = await model.user.create(userModel)
    return userModel
}


exports.insertPatient = async function(patientParams) {
    const patientModel = {
        patient_ID: 'PATIENT-' + uuid.v4(),
        user_ID: patientParams.user_ID,
        patient_first_name: patientParams.Fname,
        patient_last_name: patientParams.Lname,
        patient_contact_number: patientParams.contact,
        patient_middle_name: patientParams.Mname,
        patient_dateOfBirth: patientParams.birth,
        patient_address: patientParams.address,
        patient_gender: patientParams.gender
    }

    await model.patient.create(patientModel)
    return patientModel.patient_ID
}



exports.InsertDoctor = async function(Doctor, HMO_ID) {
    const doctorModel = {
        doctor_ID: "MCM-" + uuid.v4(),
        doctor_first_name: Doctor.firstName,
        doctor_last_name: Doctor.lastName,
        doctor_email: Doctor.email,
        doctor_gender: Doctor.gender,
        doctor_contact_number: Doctor.contact_number,
        doctor_dateOfBirth: Doctor.dateOfBirth,
        doctor_room: Doctor.room,
        doctorSpecializationSpecializationID: Doctor.specialization_ID,
    }

    const newDoctor = await model.doctor.create(doctorModel)
    const HMO = await model.HMO.findByPk(HMO_ID)
    await HMO.addDoctor(newDoctor)

}
exports.insertHmoList = async function(HMO_list) {
    const inserted = await model.HMO.bulkCreate(HMO_list)
    console.log(inserted)
}
exports.insertDepartmentList = async function(Department_List) {
    const inserted = await model.department.bulkCreate(Department_List)
    console.log(inserted)
}

exports.insertSpecializationList = async function(specialization_List) {
    const inserted = await model.doctor_specialization.bulkCreate(specialization_List)
    console.log(inserted)
}



exports.insertAppointmentDetails = async function(params) {
    const appointmentdetailsModel = {
        appointment_ID: 'APP-' + uuid.v4(),
        patient_ID: params.patient_ID,
        doctor_schedule_ID: params.doctorSchedule_ID,
        doctor_ID: params.doctor_ID,
        appointment_start: params.start,
        appointment_queue: params.queue,
        appointment_type: params.type,
    }
    await model.appointmentDetails.create(appointmentdetailsModel)
    return appointmentdetailsModel.appointment_ID

}


/*
exports.findOneDoctor = async function(pk) {
    return await model.doctor.findByPk(pk, { raw: true })

}
exports.findOneSchedule = async function(pk) {
    return await model.doctor_schedule_table.findByPk(pk, { raw: true })

}

exports.findOnePatient = async function(pk) {
    return await model.patient.findByPk(pk, { raw: true })

}*/

exports.insertAdmin = async function(adminModel) {
    admin = {
        doctor_Secretary_ID: 'ADMIN -' + uuid.v4(),
        doctor_Secretary_username: adminModel.username,
        doctor_Secretary_password: adminModel.password,
        doctor_Secretary_first_name: adminModel.Fname,
        doctor_Secretary_last_name: adminModel.Lname,
    }
    return await model.doctor_Secretary.create(admin)
}

exports.insertDoctorAvailability = async function(params) {
    const schedule_tableModel = {
        doctor_schedule_ID: 'SCHED - ' + uuid.v4(),
        doctor_ID: params.doctor_ID,
        doctor_schedule_date: params.date,
        doctor_schedule_start_time: params.start,
        doctor_schedule_Interval: params.Interval,
        doctor_schedule_end_time: params.end,
        doctor_schedule_max_patient: params.maxPatient,
    }
    const newSchedule = await model.doctor_schedule_table.create(schedule_tableModel)
}

exports.updateDoctorAvailability = async function(params) {
    await model.doctor_schedule_table.update({
        doctor_schedule_start_time: params.start,
        doctor_schedule_end_time: params.end,
        doctor_schedule_max_patient: params.maxPatient,
        doctor_schedule_Interval: params.Interval
    }, {
        where: {
            doctor_schedule_ID: params.doctor_schedule_ID
        }
    })


}
exports.insertHeadManager = async function(params) {

    admin = {
        head_Manager_ID: "HA - " + uuid.v4(),
        head_Manager_Fname: params.Fname,
        head_Manager_Lname: params.Lname,
        head_Manager_username: params.username,
        head_Manager_password: params.password,
    }
    model.head_Manager.create(admin)
}