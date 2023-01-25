CREATE SCHEMA `HospitalDatabases`;

CREATE TABLE `HospitalDatabases`.`admin` (
  `admin_ID` int PRIMARY KEY AUTO_INCREMENT,
  `admin_email` varchar(255),
  `admin_name` varchar(255),
  `admin_username` varchar(255),
  `admin_password` varchar(255),
  `admin_contact_number` varchar(10)
);

CREATE TABLE `HospitalDatabases`.`user` (
  `user_id` varchar(30) PRIMARY KEY,
  `user_email` varchar(255),
  `user_contact` varchar(30)
  `user_OTP` int
);

CREATE TABLE `HospitalDatabases`.`patient` (
  `patient_ID` varchar(30) PRIMARY KEY,
  `user_id` varchar(30),
  `patient_first_name` varchar(255),
  `patient_last_name` varchar(255),
  `patient_middle_name` varchar(255),
  `patient_dateOfBirth` date,
  `patient_gender` varchar(1),
  `patient_address` varchar(255),
);

CREATE TABLE `HospitalDatabases`.`appointment_Details` (
  `appointment_ID` varchar(30) PRIMARY KEY AUTO_INCREMENT,
  `appointment_patient_ID` int,
  `doctor_schedule_id` int,
  `appointment_doctor_ID` int,
  `appointment_type` enum('Clinic', 'Outpatient'),
  `appointment_creation_Date` timestamp,
  `appointment_status` enum('Pending', 'Confirmed', 'Rejected', 'Cancelled') default 'Pending',
  `note` varchar(255)
);

CREATE TABLE `HospitalDatabases`.`doctor` (
  `doctor_ID` int PRIMARY KEY AUTO_INCREMENT,
  `doctor_first_name` varchar(255),
  `doctor_last_name` varchar(255),
  `doctor_dateOfBirth` date,
  `doctor_gender` varchar(1)
  `doctor_dept_ID` int,
  `doctor_contact_number` varchar(30),
  `doctor_specialization` varchar(255),
  `doctor_sub_specialization` varchar(255)
  `doctor_HMO` varchar(255)
);

CREATE TABLE `HospitalDatabases`.`doctor_schedule_table` (
  `doctor_schedule_id` int PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` int,
  `doctor_schedule_date` Date,
  `doctor_schedule_start_time` Time,
  `doctor_schedule_end_time` Time,
  `doctor_schedule_status` enum('Available', 'Unavailable') default 'Available'
);

CREATE TABLE `HospitalDatabases`.`Department` (
  `deptID` int PRIMARY KEY AUTO_INCREMENT,
  `deptName` varchar(255)
);

ALTER TABLE `HospitalDatabases`.`patient` ADD FOREIGN KEY (`user_id`) REFERENCES `HospitalDatabases`.`user` (`user_id`);

ALTER TABLE `HospitalDatabases`.`appointment_Details` ADD FOREIGN KEY (`appointment_patient_ID`) REFERENCES `HospitalDatabases`.`patient` (`patient_ID`);

ALTER TABLE `HospitalDatabases`.`appointment_Details` ADD FOREIGN KEY (`doctor_schedule_id`) REFERENCES `HospitalDatabases`.`doctor_schedule_table` (`doctor_schedule_id`);

ALTER TABLE `HospitalDatabases`.`doctor` ADD FOREIGN KEY (`doctor_dept_ID`) REFERENCES `HospitalDatabases`.`Department` (`deptID`);

ALTER TABLE `HospitalDatabases`.`doctor_schedule_table` ADD FOREIGN KEY (`doctor_id`) REFERENCES `HospitalDatabases`.`doctor` (`doctor_ID`);
