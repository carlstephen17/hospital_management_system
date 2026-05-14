CREATE DATABASE IF NOT EXISTS hospital_management_system;
USE hospital_management_system;

-- =====================================================
-- TABLE: departments
-- =====================================================
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    location VARCHAR(50)
);

-- =====================================================
-- TABLE: doctors
-- =====================================================
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    doctor_specialty VARCHAR(50),
    phone VARCHAR(15),
    department_id INT,
    email VARCHAR(255),

    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
);

-- =====================================================
-- TABLE: patients
-- =====================================================
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    gender ENUM('Male','Female'),
    address VARCHAR(100),
    medical_condition VARCHAR(255),
    blood_type ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
    status ENUM(
        'Admitted',
        'Discharged',
        'Deceased',
        'Critical',
        'Recovered',
        'Inactive'
    )
);

-- =====================================================
-- TABLE: treatments
-- =====================================================
CREATE TABLE treatments (
    treatment_id INT AUTO_INCREMENT PRIMARY KEY,
    treatment_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    cost DECIMAL(10,2),
    department_id INT,

    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
);

-- =====================================================
-- TABLE: appointments
-- =====================================================
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,

    appointment_type ENUM(
        'Consultation',
        'Follow-up',
        'Check-up',
        'Emergency',
        'Laboratory',
        'Vaccination',
        'Surgery',
        'Therapy'
    ) NOT NULL,

    appointment_date DATETIME,

    status ENUM(
        'Admitted',
        'Discharged',
        'Deceased',
        'Critical',
        'Recovered'
    ) NOT NULL DEFAULT 'Admitted',

    FOREIGN KEY (patient_id)
    REFERENCES patients(patient_id),

    FOREIGN KEY (doctor_id)
    REFERENCES doctors(doctor_id)
);

-- =====================================================
-- TABLE: patient_treatments
-- =====================================================
CREATE TABLE patient_treatments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    treatment_id INT,
    date_given DATE,

    FOREIGN KEY (patient_id)
    REFERENCES patients(patient_id),

    FOREIGN KEY (treatment_id)
    REFERENCES treatments(treatment_id)
);

-- =====================================================
-- TABLE: doctor_department
-- =====================================================
CREATE TABLE doctor_department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT,
    department_id INT,

    FOREIGN KEY (doctor_id)
    REFERENCES doctors(doctor_id),

    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
);

-- =====================================================
-- TABLE: bills
-- =====================================================
CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    treatment_id INT,
    amount DECIMAL(10,2),
    status VARCHAR(20),
    bill_date DATE,

    FOREIGN KEY (patient_id)
    REFERENCES patients(patient_id),

    FOREIGN KEY (treatment_id)
    REFERENCES treatments(treatment_id)
);