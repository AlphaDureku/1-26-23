const database = require('../database');
const pool = require('../database');


//Generate OTP and insert to Database
exports.generateOTP = async function(email) {
    const hashed = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    pool.query(`update user set user_OTP = ? where user_email = ?`, [hashed, email])
    setTimeout(() => {
        pool.query(`update user set user_OTP = NULL where user_email = ?`, [email])
        console.log("deleted")
    }, 180000);
    return hashed
}

//Get OTP and send it to server for comparison
exports.fetchPatient_OTP = async function(email) {
    return pool.query(`select user_id, user_OTP from user where user_email = ?`, [email])
}