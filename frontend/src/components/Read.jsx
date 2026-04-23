import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { URL } from "../API";

function Read() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [department, setDepartment] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [bill, setBill] = useState(null);
  const [treatment, setTreatment] = useState(null);

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function fetchAll() {
    try {
      const [
        patientsRes,
        doctorsRes,
        appointmentsRes,
        billsRes,
        treatmentsRes,
        departmentsRes,
        doctorDeptRes,
        patientTreatRes,
      ] = await Promise.all([
        fetch(`${URL}/api/patients`),
        fetch(`${URL}/api/doctors`),
        fetch(`${URL}/api/appointments`),
        fetch(`${URL}/api/bills`),
        fetch(`${URL}/api/treatments`),
        fetch(`${URL}/api/departments`),
        fetch(`${URL}/api/doctor_department`),
        fetch(`${URL}/api/patient_treatments`),
      ]);

      const patients = await patientsRes.json();
      const doctors = await doctorsRes.json();
      const appointments = await appointmentsRes.json();
      const bills = await billsRes.json();
      const treatments = await treatmentsRes.json();
      const departments = await departmentsRes.json();
      const doctorDept = await doctorDeptRes.json();
      const patientTreatments = await patientTreatRes.json();

      const selectedPatient = patients.find(
        (p) => p.patient_id === Number(id)
      );

      const selectedAppointment = appointments.find(
        (a) => a.patient_id === Number(id)
      );

      const selectedDoctor = doctors.find(
        (d) => d.doctor_id === selectedAppointment?.doctor_id
      );

      const deptLink = doctorDept.find(
        (d) => d.doctor_id === selectedDoctor?.doctor_id
      );

      const selectedDepartment = departments.find(
        (d) => d.department_id === deptLink?.department_id
      );

      const selectedBill = bills.find(
        (b) => b.patient_id === Number(id)
      );

      const ptLink = patientTreatments.find(
        (pt) => pt.patient_id === Number(id)
      );

      const selectedTreatment = treatments.find(
        (t) => t.treatment_id === ptLink?.treatment_id
      );

      setPatient(selectedPatient || null);
      setDoctor(selectedDoctor || null);
      setDepartment(selectedDepartment || null);
      setAppointment(selectedAppointment || null);
      setBill(selectedBill || null);
      setTreatment(selectedTreatment || null);

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  if (!patient) return <p>Loading...</p>;

  return (
    <div>
      <h1>Patient Details</h1>

      <p>Patient ID: {patient.patient_id}</p>
      <p>Patient Name: {patient.patient_name}</p>
      <p>Condition: {patient.condition}</p>

      <p>Doctor Name: {doctor?.doctor_name || "N/A"}</p>
      <p>Doctor Specialty: {doctor?.doctor_specialty || "N/A"}</p>

      <p>Department Name: {department?.department_name || "N/A"}</p>
      <p>Department Location: {department?.location || "N/A"}</p>

      <p>
        Appointment Date: {appointment?.appointment_date || "N/A"}
      </p>

      <p>
        Treatment Name: {treatment?.treatment_name || "N/A"}
      </p>

      <p>Cost: {bill?.amount || "N/A"}</p>
      <p>Bill Status: {bill?.status || "N/A"}</p>
    </div>
  );
}

export default Read;