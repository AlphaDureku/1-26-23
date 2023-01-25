const model = require('../sequelize_sequelizeModel')
const uuid = require('uuid')
const Sequelize = require('sequelize')


exports.generateOTP = async function(email) {
    const generatedOTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    model.user.update({
        user_OTP: generatedOTP
    }, {
        where: {
            user_email: email
        }
    })

    setTimeout(() => {
        model.user.update({
            user_OTP: null
        }, {
            where: {
                user_email: email
            }
        })
        console.log("deleted")
    }, 180000);
    return generatedOTP
}

//Get OTP and send it to server for comparison
exports.fetchPatient_OTP = async function(email) {
    return model.user.findAll({
        raw: true,
        attributes: ['user_ID', 'user_OTP'],

        where: {
            user_email: email
        }

    })
}