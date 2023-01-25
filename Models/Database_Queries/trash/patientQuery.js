const database = require('../database');
const pool = require('../database');

//Insert new patient
exports.insertPatient = async function(first_name, last_name, email, contact, address, age, gender) {
    pool.query(`insert into patient(patient_ID, patient_first_name, patient_last_name, patient_email, patient_contact_number, patient_address, patient_age, gender)
    values(?, ?, ? , ? ,? ,?, ?, ?)`, [uniqid(), first_name, last_name, email, contact, address, age, gender])
}


// Get Email from All patients
exports.fetchUser_Directory = async function() {
    return pool.query(`select user_email from user`)
}

//Get Patient Appointment List by passing their patient email
exports.fetchPatient_Appointments_Using_Email = async function(patient_Email) {
    return pool.query(`select * from patient where user_id = (select user_id from user where user_email = ?)`, [patient_Email])
}

exports.fetch_User_Patients = async function(user_ID) {
    return pool.query(`select patient_ID, patient_first_name, patient_last_name from patient where user_ID = ?`, [user_ID])
}


//Get Patient Appointment List with their INFO by passing their patient ID
exports.fetchPatient_Appointments_Using_Patient_ID = async function(patient_id) {
        return pool.query(`select patient_first_name, user.user_email, patient_last_name, doctor_first_name, doctor_last_name, gender, doctor_specialization, date_format(doctor_schedule_date,'%b %e, %Y') AS date, time_format(doctor_schedule_start_time, '%h:%i %p') AS doctor_schedule_start_time, doctor_HMO, appointment_status, patient_age from patient
                       inner join appointment_details on patient.patient_id = appointment_details.appointment_patient_id
                       inner join user on patient.user_id = user.user_id
                       inner join doctor on doctor.doctor_id = appointment_details.appointment_doctor_ID
                       left join doctor_schedule_table on appointment_details.doctor_schedule_id = doctor_schedule_table.doctor_schedule_id
                       where patient.patient_id = ?`, [patient_id])
    }
    //DONE

//Generate Uniq Patient ID
function uniqid(prefix = "", random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
};