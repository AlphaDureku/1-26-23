

select * from user
select * from patient
select * from appointment_details
select * from doctor
select * from doctor_schedule_table
select * from appointment_details

insert into user (user_id, user_email, user_contact) values('1', 'templanzamark2002@gmail.com', '09653876383')
insert into patient(patient_ID, user_id, patient_first_name, patient_last_name, patient_age, patient_address) values('1', '1', "Mark", "Templanza", "20", "1255 De Vera")
insert into patient(patient_ID, user_id, patient_first_name, patient_last_name, patient_age, patient_address) values('2', '1', "Bond", "Man", "20", "1255 De Vera")
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Nolasco','Ang', 'Dermatologist', 'AMAPHIL');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Anne Michelle','Avelino', 'Dentist', 'AON Insurance Reinsurance / Ayala AON');
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(2, "2022-12-08", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(2, "2022-12-12", "012:00:00", "01:00:00");

select doctor_first_name, doctor_last_name, doctor_specialization,date_format(doctor_schedule_date, '%b %e, %Y')
 from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID where doctor_schedule_id = 4

insert into appointment_details(appointment_patient_ID, doctor_schedule_id, appointment_doctor_ID, appointment_creation_Date, note)
values(1,
 1, (select doctor_id from doctor_schedule_table where doctor_schedule_id =1), curdate(), "Appoinment made by Mark")

 insert into appointment_details(appointment_patient_ID, doctor_schedule_id, appointment_doctor_ID, appointment_creation_Date, note)
values(2,
 3, (select doctor_id from doctor_schedule_table where doctor_schedule_id =3), curdate(), "Appoinment made by Bond")


delete from doctor_schedule_table where doctor_schedule_id = '2'
alter table user modify column user_contact varchar(11)
alter table patient add column gender varchar(10)

alter table user add column user_OTP int


select doctor.doctor_ID, doctor_schedule_ID, doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO, date_format(doctor_schedule_date, '%W') AS day, doctor_schedule_start_time AS start, doctor_schedule_end_time AS end
                       from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID where doctor.doctor_ID = 1 AND doctor_schedule_date = '2022-12-05'

            