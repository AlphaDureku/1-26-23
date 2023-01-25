use hospitaldatabase;

--select queries
select * from doctor
--select doctor info and schedule
select doctor_first_name, doctor_last_name, doctor_specialization, date_format(doctor_schedule_date, '%W') AS day, doctor_schedule_start_time AS start, doctor_schedule_end_time AS end
from doctor inner join doctor_schedule_table on doctor_schedule_table.doctor_id = doctor.doctor_ID 
select * from doctor_schedule_table
select * from patient
select * from appointment_details
--show schedule without unavaiable
select * from doctor_schedule_table where doctor_id = 1 AND doctor_schedule_status = 'AVAILABLE'
--show appointment details from doctor's perspective
select * from appointment_details where appointment_doctor_ID = 1
select appointment_details.appointment_patient_ID, appointment_details.appointment_doctor_ID, doctor_schedule_table.doctor_schedule_date, doctor_schedule_table.doctor_schedule_start_time, appointment_details.appointment_status
from appointment_details
Left join doctor_schedule_table ON appointment_Details.doctor_schedule_id = doctor_schedule_table.doctor_schedule_id 

--show appointment details from patient's perspective
select * from appointment_details where appointment_patient_ID = (select patient_id from patient where patient_email = "templanzamark2003@gmail.com")

--query for getting all appointment for patients
select patient_first_name, patient_last_name, doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO, doctor_schedule_date, appointment_status from patient
inner join appointment_details on patient.patient_id = appointment_details.appointment_patient_id
inner join doctor on doctor.doctor_id = appointment_details.appointment_doctor_ID 
left join doctor_schedule_table on appointment_details.doctor_schedule_id = doctor_schedule_table.doctor_schedule_id
where patient.patient_id = "5eed4c4463530c"
--insert queries
-- insert Doctor
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Nolasco','Ang', 'Dermatologist', 'AMAPHIL');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Antonio','Tabang', 'Dentist', 'AON Insurance Reinsurance / Ayala AON');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Dominic Lemuel','Sevilla', 'Dermatologist', 'Asianlife and General Assurance');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Maria Jona','Godoy', 'Pediatrics', 'Blue cross');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Eligio','Batitis', 'Neurologist', 'Caritas Healthshield');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('John Mark','Garcia', 'Pathology', 'Cooperative Health');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Raphael Benjamin','Arada', 'Colposcopy', 'Flexicare');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Mario Emmanuel','De Leon', 'Ultrasound', 'AON Insurance Reinsurance / Ayala AON');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Mary Ruth','Padua', 'Urology', 'Asianlife and General Assurance');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Alaric Emmanuel','Salonga', 'Pathology', 'Blue cross');

insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Kevin ','Cabrera', 'Pathology', 'AMAPHIL');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Anne Michelle','Avelino', 'Dentist', 'AON Insurance Reinsurance / Ayala AON');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Genaro Wilfred Francisco','Asis', 'Pediatrics', 'Asianlife and General Assurance');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Anne Margaux Emmanuel','Artates', 'Colposcopy', 'Blue cross');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Erlinda Armovit','Armovit', 'Colposcopy', 'Caritas Healthshield');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Vilma','Arizala', 'Urology', 'Blue cross');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Maria Constancia Emmanuel','Wylengco', 'Pathology', 'Flexicare');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Mayla ','Wahab-Tee', 'Ultrasound', 'Caritas Healthshield');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Arvin','De Castillo', 'Colposcopy', 'Cooperative Health');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Daniel','Guevara', 'Pathology', 'Blue cross');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Josephine','Dela Ysla-Sorilla', 'Pediatrics', 'Asianlife and General Assurance');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('John Paulo','Vergara', 'Pathology', 'Blue cross');
insert into doctor(doctor_first_name, doctor_last_name, doctor_specialization, doctor_HMO) values('Kenneth','Samala', 'Pediatrics', 'AMAPHIL');



--insert Schedule
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(1, "2022-12-05", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(1, "2022-12-06", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(1, "2022-12-07", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(1, "2022-12-08", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(2, "2022-12-09", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(2, "2022-12-10", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(2, "2022-12-11", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(2, "2022-12-12", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(3, "2022-12-05", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(3, "2022-12-06", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(3, "2022-12-07", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(3, "2022-12-08", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(4, "2022-12-09", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(4, "2022-12-10", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(4, "2022-12-11", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(4, "2022-12-12", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(5, "2022-12-05", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(5, "2022-12-06", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(5, "2022-12-07", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(5, "2022-12-08", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(6, "2022-12-09", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(6, "2022-12-10", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(6, "2022-12-11", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(6, "2022-12-12", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(7, "2022-12-11", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(7, "2022-12-12", "09:00:00", "10:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(7, "2022-12-13", "12:00:00", "01:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(8, "2022-12-11", "01:00:00", "02:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(8, "2022-12-12", "02:00:00", "03:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(8, "2022-12-13", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(9, "2022-12-15", "10:00:00", "11:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(9, "2022-12-16", "01:00:00", "02:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(9, "2022-12-17", "08:00:00", "09:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(10, "2022-12-13", "03:00:00", "04:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(10, "2022-12-14", "05:00:00", "06:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(10, "2022-12-15", "10:00:00", "11:00:00");
insert into doctor_schedule_table(doctor_id, doctor_schedule_date, doctor_schedule_start_time, doctor_schedule_end_time) values(10, "2022-12-16", "02:00:00", "03:00:00");

--insert Patient
NASA TRACK APPOINTMENTCONTROLLER


--Appointment
--Insert appointment details
insert into appointment_details(appointment_patient_ID, doctor_schedule_id, appointment_doctor_ID, appointment_creation_Date, patient_message)
values((select patient_id from patient where patient_email = "templanzamark2002@gmail.com"),
 62, (select doctor_id from doctor_schedule_table where doctor_schedule_id =62), curdate(), "Appoinment made by Mark")

insert into appointment_details(appointment_patient_ID, doctor_schedule_id, appointment_doctor_ID, appointment_creation_Date, patient_message)
values((select patient_id from patient where patient_email = "templanzamark2003@gmail.com"), 26,
(select doctor_id from doctor_schedule_table where doctor_schedule_id =26), curdate(), "Appoinment made by John Deep")
--then set the appointment ID status to unavailable
update doctor_schedule_table set doctor_schedule_status = "UNAVAILABLE" where doctor_schedule_id = 2
update doctor_schedule_table set doctor_schedule_status = "UNAVAILABLE" where doctor_schedule_id = 6
--then the doctor's secretary will decide if confirm or rejected, SEND AN EMAIL REGARDING THE STATUS
update appointment_details set appointment_status = "CONFIRMED" where appointment_doctor_id = 1 AND appointment_patient_id = 1
update appointment_details set appointment_status = "CONFIRMED" where appointment_ID = 31
update patient set patient_email = "templanzamark2003@gmail.com" where patient_id = 1
update patient set gender = 'Male' 

--Alter table
alter table doctor_schedule_table Alter doctor_schedule_status set DEFAULT 'AVAILABLE'
alter table appointment_details Alter appointment_status set DEFAULT 'PENDING'
alter table patient alter column patient_contact_number varchar(11)
alter table patient add column patient_age int
alter table patient add column gender varchar(10)
alter table doctor Auto_increment = 1
alter table doctor rename column doctor_HMO to doctor_doctor_HMO
alter table appointment_details modify column appointment_status enum('CANCELLED','COMPLETED', 'CONFIRMED', 'PENDING')
alter table appointment_details alter appointment_status set DEFAULT 'PENDING'

delete from patient where patient_first_name = "John" 
delete from appointment_details where appointment_id = 2
delete from doctor
delete from doctor_schedule_table
delete from doctor_schedule_table where doctor_schedule_id between 65 AND 70

delete from patient where patient_ID = '5efdb5a9fee690'
delete from appointment_Details
