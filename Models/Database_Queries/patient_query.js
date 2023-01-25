const model = require('../sequelize_sequelizeModel')
const Sequelize = require('sequelize')

exports.fetchUser_Directory = async function() {
    return await model.user.findAll({
        raw: true,
        attributes: [
            'user_email'
        ]

    })
}
exports.findUserUsingEmail = async function(email) {
    return await model.user.findOne({
        raw: true,
        attributes: [
            'user_ID'
        ],
        where: { user_email: email }
    })
}

exports.fetchPatient_Appointments_Using_Email = async function(patient_Email) {
    return await model.patient.findAll({
        raw: true,
        limit: 1,
        where: {
            user_ID: {
                [Sequelize.Op.eq]: Sequelize.literal(`(SELECT user_ID FROM user WHERE user_email = "${patient_Email}")`)
            }
        }
    })
}

exports.fetch_User_Patients = async function(user_ID) {
    return await model.patient.findAndCountAll({
        raw: true,
        attributes: [
            'patient_ID',
            'patient_first_name',
            'patient_last_name',
            'patient_gender',
        ],
        include: [{
            model: model.user,
            attributes: []
        }],
        where: {
            user_ID: user_ID
        }
    })
}

exports.fetch_Patient_Info_Using_Patient_ID = async function(patient_ID) {
    return await model.patient.findOne({
        raw: true,
        attributes: [
            'patient_first_name',
            'patient_last_name',
            'patient_middle_name',
            'patient_contact_number', [Sequelize.fn('date_format', Sequelize.col('patient_dateOfBirth'), '%Y-%m-%d'), 'dateOfBirth'],
            'patient_address',
            'patient_gender', [Sequelize.col('user_email'), 'email'],
        ],
        include: [{
            model: model.user,
            attributes: []
        }]
    })
}

exports.fetchPatient_Appointments_Using_Patient_ID = async function(patient_ID) {
    const age = Sequelize.fn(
        'TIMESTAMPDIFF',
        Sequelize.literal('YEAR'),
        Sequelize.literal('patient_dateOfBirth'),
        Sequelize.fn('NOW')
    );
    return await model.patient.findAll({
        raw: true,
        attributes: [
            [Sequelize.col('appointment_ID'), 'appointment_ID'],
            'patient_first_name',
            'patient_last_name', ['patient_gender', 'gender'],
            [age, 'patient_age'],
            [Sequelize.col('user_email'), 'email'],
            [Sequelize.col('appointmentDetails.doctor_ID'), 'doctor_ID'],
            [Sequelize.col('appointment_type'), 'type'],
            [Sequelize.col('doctor_first_name'), 'doctor_Fname'],
            [Sequelize.col('specialization_Name'), 'specialization'],
            [Sequelize.col('doctor_last_name'), 'doctor_Lname'],
            [Sequelize.col('appointment_type'), 'type'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('appointment_start'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
            [Sequelize.col('appointment_status'), 'status'],
        ],
        include: [{
                model: model.user,
                attributes: [],
            },

            {
                model: model.appointmentDetails,
                attributes: [],
                required: true,
                include: [{
                        model: model.doctor,
                        attributes: [],
                        required: true,
                        include: [{
                            model: model.doctor_specialization
                        }]
                    },
                    {
                        model: model.doctor_schedule_table,
                        attributes: [],
                        required: false
                    },
                ]
            }
        ],
        where: {
            patient_ID: patient_ID
        }
    })
}

exports.getappointmentDetails = async function(appointment_ID) {
    const age = Sequelize.fn(
        'TIMESTAMPDIFF',
        Sequelize.literal('YEAR'),
        Sequelize.literal('patient_dateOfBirth'),
        Sequelize.fn('NOW')
    );
    return await model.appointmentDetails.findOne({
        raw: true,
        attributes: [
            [Sequelize.col('patient_first_name'), 'patient_first_name'],
            [Sequelize.col('patient_last_name'), 'patient_last_name'],
            [Sequelize.col('patient_gender'), 'gender'],
            [age, 'patient_age'],
            [Sequelize.col('user_Email'), 'email'],
            [Sequelize.col('doctor_first_name'), 'doctor_first_name'],
            [Sequelize.col('doctor_first_name'), 'doctor_last_name'],
            [Sequelize.col('specialization_name'), 'specialization'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('appointment_start'), '%l:%i %p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%l:%i %p'), 'end'],

        ],
        include: [{
            model: model.patient,
            attributes: [],
            include: [{
                model: model.user,
                attributes: []
            }]
        }, {
            model: model.doctor,
            attributes: [],
            include: [{
                model: model.doctor_specialization,
                attributes: []
            }]
        }, {
            model: model.doctor_schedule_table,
            attributes: []
        }],

        where: {
            appointment_ID: appointment_ID
        }

    })
}

exports.getReceipt = async function(doctor_schedule_ID) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_first_name',
            'doctor_last_name', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.col('doctor_specialization.specialization_Name'), 'specialization'],
            [Sequelize.col('doctor_schedule_date'), 'date'],
            [Sequelize.col('doctor_schedule_start_time'), 'start'],
            [Sequelize.col('doctor_schedule_end_time'), 'end'],
            [Sequelize.col('doctor_schedule_current_queue'), 'current'],
            [Sequelize.col('doctor_schedule_Interval'), 'interval'],
        ],
        include: [{
            model: model.doctor_schedule_table,
            attributes: [],
            required: true,
            where: {
                doctor_schedule_ID: doctor_schedule_ID
            }
        }, {
            model: model.doctor_specialization,
        }],


    })
}

exports.updatePatientInfo = async function(patientModel) {
    await model.patient.update({
        patient_first_name: patientModel.Fname,
        patient_middle_name: patientModel.Mname,
        patient_last_name: patientModel.Lname,
        patient_contact_number: patientModel.contact,
        patient_address: patientModel.address,
        patient_dateOfBirth: patientModel.birth
    }, {
        where: {
            patient_ID: patientModel.patient_ID
        }
    })
}

exports.getAppointmentEmail = async function(ID) {
    return await model.appointmentDetails.findAll({
        raw: true,
        attributes: [
            [Sequelize.col('user_email'), 'email'],
        ],
        include: [{
            model: model.patient,
            attributes: [],
            include: [{
                model: model.user,
                attributes: []
            }]
        }],
        where: [{
            appointment_ID: ID
        }]
    })
}