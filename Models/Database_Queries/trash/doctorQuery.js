const database = require('../../database');
const pool = require('../../database');

exports.getOneDoctor = async function(id) {
    return pool.query(`select doctor_schedule_id, date_format(doctor_schedule_date, '%W') AS day,
                         date_format(doctor_schedule_date, '%b %e, %Y') AS date,
                         date_format(doctor_schedule_date, '%Y-%m-%d') AS date2,
                        doctor_schedule_start_time AS start, doctor_schedule_end_time AS end
                        from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID where doctor.doctor_ID = ?`, [id])
}
exports.getOneDoctor2 = async function(id) {
    return pool.query(`select doctor_schedule_id, date_format(doctor_schedule_date, '%W') AS day
                        ,date_format(doctor_schedule_date, '%b %e, %Y') AS date,date_format(doctor_schedule_date, '%Y/%m/%d') AS date2, doctor_schedule_start_time AS start, doctor_schedule_end_time AS end
                       from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID where doctor.doctor_ID = ?`, [id])
}

//Done
exports.getDoctor = async function() {
        return pool.query(`select doctor_ID, doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO from doctor order by doctor_last_name ASC`)
    }
    //Done
exports.getSchedule = async function() {
    return pool.query(`select doctor.doctor_ID, date_format(doctor_schedule_date, '%W') AS day, date_format(doctor_schedule_date, '%b %e, %Y') AS date, doctor_schedule_start_time AS start, doctor_schedule_end_time AS end
    from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID `)
}

//Get Doctor's List filtered by Specialization and SUB Specialization
exports.getDoctor_Using_Spec_doctor_HMO = async function(searchOption) {
    return pool.query(`select doctor_ID, doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO  from doctor where doctor_specialization = ? OR doctor_HMO = ?`, [searchOption.Specialization, searchOption.doctor_HMO])
}

exports.getSchedule_Using_Spec_doctor_HMO = async function(searchOption) {
        return pool.query(`select doctor.doctor_ID, date_format(doctor_schedule_date, '%W') AS day, doctor_schedule_start_time AS start
                          from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID
                          where doctor.doctor_Specialization = ? OR doctor.doctor_HMO = ?`, [searchOption.Specialization, searchOption.doctor_HMO])
    }
    //Get Doctor's List using ALL search queries
exports.getDoctor_Using_All = async function(searchOption) {
    console.log(searchOption)
    return pool.query(`select doctor_ID, doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO from doctor
                      where  doctor_Specialization = ? OR  doctor_HMO = ? having doctor_first_name LIKE ? OR doctor_last_name LIKE ?`, [searchOption.Specialization, searchOption.doctor_HMO, `%${searchOption.Fname}%`, `%${searchOption.Lname}%`])
}
exports.getSchedule_Using_All = async function(searchOption) {
    return pool.query(`select doctor.doctor_ID, doctor_first_name, doctor_last_name,date_format(doctor_schedule_date, '%W') AS day, doctor_schedule_start_time AS start
                       from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID
                       where doctor_Specialization = ? OR  doctor_HMO = ? having doctor_first_name LIKE ? OR doctor_last_name LIKE ?`, [searchOption.Specialization, searchOption.doctor_HMO, `%${searchOption.Fname}%`, `%${searchOption.Lname}%`])
}

exports.getDoctor_Using_Fname_Lname = async function(searchOption) {
        return pool.query(`select doctor_ID, doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO  from doctor where doctor_first_name LIKE ? AND doctor_last_name LIKE ?`, [`%${searchOption.Fname}%`, `%${searchOption.Lname}%`])
    }
    //Done
exports.getSchedule_Using_Fname_Lname = async function(searchOption) {
    return pool.query(`select doctor.doctor_ID, date_format(doctor_schedule_date, '%W') AS day, doctor_schedule_start_time AS start
from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID where doctor_first_name LIKE ? AND doctor_last_name LIKE ?`, [`%${searchOption.Fname}%`, `%${searchOption.Lname}%`])
}

//Get Doctor's List filtered by their FIRST name
exports.getDoctor_Using_Fname = async function(searchOption) {
    return pool.query(`select doctor_ID, doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO  from doctor having  doctor_first_name LIKE ?`, [`%${searchOption.Fname}%`])
}

exports.getSchedule_Using_Fname = async function(searchOption) {
    return pool.query(`select doctor.doctor_ID, date_format(doctor_schedule_date, '%W') AS day, doctor_schedule_start_time AS start
from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID where doctor_first_name LIKE ?`, [`%${searchOption.Fname}%`])
}

//Get Doctor's List filtered by their LAST name
exports.getDoctor_Using_Lname = async function(searchOption) {
    return pool.query(`select doctor_ID, doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO  from doctor having doctor_last_name LIKE ?`, [`%${searchOption.Lname}%`])
}
exports.getSchedule_Using_Lname = async function(searchOption) {
    return pool.query(`select doctor.doctor_ID, date_format(doctor_schedule_date, '%W') AS day, doctor_schedule_start_time AS start
    from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID where doctor_last_name LIKE ?`, [`%${searchOption.Lname}%`])
}

exports.getReceipt = async function(doctor_schedule_ID) {
    return pool.query(`select doctor_first_name, doctor_last_name, doctor_specialization,date_format(doctor_schedule_date, '%b %e, %Y') As date,
                     doctor_schedule_start_time AS start
                     from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID
                      where doctor_schedule_id = ?`, [doctor_schedule_ID])
}