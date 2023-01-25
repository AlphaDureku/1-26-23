const model = require('../sequelize_sequelizeModel')
const uuid = require('uuid')
const Sequelize = require('sequelize')


exports.AuthorizeAdmin = async function(username) {
    return await model.head_Manager.findOne({
        raw: true,
        attributes: [
            'head_Manager_username', 'head_Manager_password', 'head_Manager_ID'
        ],
        where: {
            head_Manager_username: username
        }
    })
}

exports.getHeadAdmin = async function(ID) {
    return await model.head_Manager.findOne({
        raw: true,
        attributes: [
            'head_Manager_username', 'head_Manager_password', 'head_Manager_ID', 'head_Manager_Fname', 'head_Manager_Lname'
        ],
        where: {
            head_Manager_ID: ID
        }
    })
}


exports.getDoctorWithoutNurse = async function() {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID', ['doctor_first_name', 'DFname'],
            ['doctor_last_name', 'DLname']
        ],
        where: {
            doctorSecretaryDoctorSecretaryID: null
        },
        order: [
            ['doctor_last_name', 'asc']
        ],


    })
}

exports.getDoctorWithoutNurseWithSearch = async function(searchQuery) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID', ['doctor_first_name', 'DFname'],
            ['doctor_last_name', 'DLname']
        ],

        where: [{
            doctorSecretaryDoctorSecretaryID: null,
            [Sequelize.Op.or]: [{
                    doctor_first_name: {
                        [Sequelize.Op.like]: `%${searchQuery}%`
                    }
                },
                {
                    doctor_last_name: {
                        [Sequelize.Op.like]: `%${searchQuery}%`
                    }
                }
            ]
        }],
        order: [
            ['doctor_last_name', 'asc']
        ],


    })
}
exports.getDoctorWithNurse = async function() {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID', ['doctor_first_name', 'DFname'],
            ['doctor_last_name', 'DLname'],
            [Sequelize.col('doctor_Secretary_ID'), 'nurse_ID'],
            [Sequelize.col('doctor_Secretary_first_name'), 'nurse_Fname'],
            [Sequelize.col('doctor_Secretary_last_name'), 'nurse_Lname'],
        ],
        include: [{
            model: model.doctor_Secretary,
        }],
        where: {
            doctorSecretaryDoctorSecretaryID: {
                [Sequelize.Op.ne]: null
            }
        },
        order: [
            ['doctor_last_name', 'asc']
        ],
    })
}

exports.getNurses = async function() {
    return await model.doctor_Secretary.findAll({
        raw: true,
        order: [
            ['doctor_Secretary_first_name', 'asc']
        ],
    })
}


exports.match = async function(doctor_ID, nurse_ID) {
    await model.doctor.update({
            doctorSecretaryDoctorSecretaryID: nurse_ID,

        }, {
            where: {
                doctor_ID: doctor_ID
            }
        }

    )
}

exports.removeDoctor = async function(doctor_ID) {
    await model.doctor.destroy({
        where: {
            doctor_ID: doctor_ID
        }
    })
}