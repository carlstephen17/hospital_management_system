import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate } from "react-router-dom";

function NF1() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [patientTreatments, setPatientTreatments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
    fetchBills();
    fetchTreatments();
    fetchDepartments();
    fetchPatientTreatments();
  }, []);

  async function fetchPatients() {
    const res = await fetch(`${URL}/api/patients`);
    const data = await res.json();
    if (res.ok) setPatients(data);
  }

  async function fetchDoctors() {
    const res = await fetch(`${URL}/api/doctors`);
    const data = await res.json();
    if (res.ok) setDoctors(data);
  }

  async function fetchAppointments() {
    const res = await fetch(`${URL}/api/appointments`);
    const data = await res.json();
    if (res.ok) setAppointments(data);
  }

  async function fetchBills() {
    const res = await fetch(`${URL}/api/bills`);
    const data = await res.json();
    if (res.ok) setBills(data);
  }

  async function fetchTreatments() {
    const res = await fetch(`${URL}/api/treatments`);
    const data = await res.json();
    if (res.ok) setTreatments(data);
  }

  async function fetchDepartments() {
    const res = await fetch(`${URL}/api/departments`);
    const data = await res.json();
    if (res.ok) setDepartments(data);
  }

  async function fetchPatientTreatments() {
    const res = await fetch(`${URL}/api/patient_treatments`);
    const data = await res.json();
    if (res.ok) setPatientTreatments(data);
  }

  const getDoctorForPatient = (patientId) => {
    const appointment = appointments.find(
      (a) => String(a.patient_id) === String(patientId)
    );

    if (!appointment) return { doctor_name: "N/A", doctor_specialty: "N/A" };

    const doctor = doctors.find(
      (d) => String(d.doctor_id) === String(appointment.doctor_id)
    );

    return doctor || { doctor_name: "N/A", doctor_specialty: "N/A" };
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>NF1 - Patient Records</h2>

      <button onClick={() => navigate("/")}>Back Home</button>

      <table border="1" cellPadding="5" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Condition</th>
            <th>Status</th>
            <th>Doctor</th>
            <th>Specialty</th>
            <th>Department</th>
            <th>Location</th>
            <th>Schedule</th>
            <th>Treatment</th>
            <th>Bill Status</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => {
            const doctor = getDoctorForPatient(p.patient_id);

            const department = departments.find(
              (d) => String(d.department_id) === String(doctor.department_id)
            );

            const appointment = appointments.find(
              (a) => String(a.patient_id) === String(p.patient_id)
            );

            const patientBills = bills.filter(
              (b) => String(b.patient_id) === String(p.patient_id)
            );

            const billStatus = patientBills.length
              ? patientBills[0].status
              : "None";

            const treatmentsList = patientTreatments
              .filter((pt) => String(pt.patient_id) === String(p.patient_id))
              .map((pt) => {
                const t = treatments.find(
                  (x) => String(x.treatment_id) === String(pt.treatment_id)
                );
                return t ? t.treatment_name : "Unknown";
              })
              .join(", ");

            return (
              <tr key={p.patient_id}>
                <td>{p.patient_name}</td>
                <td>{p.phone}</td>
                <td>{p.gender}</td>
                <td>{p.address}</td>
                <td>{p.condition}</td>
                <td>{p.status}</td>
                <td>{doctor.doctor_name}</td>
                <td>{doctor.doctor_specialty}</td>
                <td>{department?.department_name || "—"}</td>
                <td>{department?.location || "—"}</td>
                <td>{appointment?.appointment_date || "—"}</td>
                <td>{treatmentsList || "—"}</td>
                <td>{billStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default NF1;