import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate } from "react-router-dom";

function Home() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
    fetchBills();
    fetchTreatments();
    fetchDepartments();
  }, []);

  async function fetchPatients() {
    try {
      const res = await fetch(`${URL}/api/patients`);
      const data = await res.json();
      if (res.ok) setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  }

  async function fetchDoctors() {
    try {
      const res = await fetch(`${URL}/api/doctors`);
      const data = await res.json();
      if (res.ok) setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  }

  async function fetchAppointments() {
    try {
      const res = await fetch(`${URL}/api/appointments`);
      const data = await res.json();
      if (res.ok) setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }

  async function fetchBills() {
    try {
      const res = await fetch(`${URL}/api/bills`);
      const data = await res.json();
      if (res.ok) setBills(data);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  }

  async function fetchTreatments() {
    try {
      const res = await fetch(`${URL}/api/treatments`);
      const data = await res.json();
      if (res.ok) setTreatments(data);
    } catch (err) {
      console.error("Error fetching treatments:", err);
    }
  }

  async function fetchDepartments() {
    try {
      const res = await fetch(`${URL}/api/departments`);
      const data = await res.json();
      if (res.ok) setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
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

  const handleDelete = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      const res = await fetch(`${URL}/api/patients/${patientId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Patient deleted successfully!");
        setPatients(patients.filter((p) => p.patient_id !== patientId));
      } else alert("Failed to delete patient.");
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Error deleting patient.");
    }
  };

  async function handleDeleteAll() {
    if (!window.confirm("Are you sure you want to delete ALL patients?"))
      return;
    try {
      const res = await fetch(`${URL}/api/deleteAll`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("All patients and related records deleted successfully!");
        setPatients([]);
        setDoctors([]);
        setAppointments([]);
        setBills([]);
        setTreatments([]);
        setDepartments([]);
      } else {
        alert("Failed to delete all patients and related records.");
      }
    } catch (err) {
      console.error("Error deleting all patients and related records:", err);
      alert("Error deleting all patients and related records.");
    }
  }

  return (
    <div>
      <h2>Patients, Doctors, Department, Appointments, Treatments & Bills</h2>
      <button onClick={() => navigate("/create")}>Add New Patient</button>
      <button onClick={() => {handleDeleteAll()}}>Delete All</button>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Condition</th>
            <th>Patient Status</th>
            <th>Doctor Name</th>
            <th>Doctor Specialty</th>
            <th>Department</th>
            <th>Schedule</th>
            <th>Treatment & Cost</th>
            <th>Bill Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const doctor = getDoctorForPatient(patient.patient_id);

            const patientBills = bills.filter(
              (b) => String(b.patient_id) === String(patient.patient_id)
            );

            const department = departments.find(
              (d) => String(d.department_id) === String(doctor.department_id)
            );

            const appointment = appointments.find(
              (a) => String(a.patient_id) === String(patient.patient_id)
            );

            console.log(
              "Patient ID:",
              patient.patient_id,
              "Appointment:",
              appointment
            );

            const treatmentInfo = patientBills
              .map((bill) => {
                const treatment = treatments.find(
                  (t) =>
                    String(t.treatment_id) === String(bill.treatment_id)
                );
                return treatment
                  ? `${treatment.treatment_name} ($${bill.amount})`
                  : `$${bill.amount}`;
              })
              .join(", ");

            const billStatus = patientBills.length
              ? patientBills[0].status
              : "None";

            return (
              <tr key={patient.patient_id}>
                <td>{patient.patient_name}</td>
                <td>{patient.phone}</td>
                <td>{patient.gender}</td>
                <td>{patient.address}</td>
                <td>{patient.condition}</td>
                <td>{patient.status}</td>
                <td>{doctor.doctor_name}</td>
                <td>{doctor.doctor_specialty}</td>
                <td>{department ? department.department_name : "N/A"}</td>
                <td>
                  {appointment?.appointment_date || "N/A"}
                </td>
                <td>{treatmentInfo || "None"}</td>
                <td>{billStatus}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/patients/read/${patient.patient_id}`)
                    }
                  >
                    Read
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/patients/edit/${patient.patient_id}`)
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(patient.patient_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Home;