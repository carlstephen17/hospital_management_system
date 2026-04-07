import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../API";

function Create() {
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientCondition, setPatientCondition] = useState("");
  const [patientStatus, setPatientStatus] = useState("Admitted");

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentCost, setTreatmentCost] = useState("");

  const [billAmount, setBillAmount] = useState("");
  const [billStatus, setBillStatus] = useState("Unpaid");

  useEffect(() => {
    async function fetchData() {
      try {
        const doctorRes = await fetch(`${URL}/api/doctors`);
        setDoctors(await doctorRes.json());

        const deptRes = await fetch(`${URL}/api/departments`);
        setDepartments(await deptRes.json());
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Create Patient
      const patientRes = await fetch(`${URL}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName,
          phone: patientPhone,
          gender: patientGender,
          address: patientAddress,
          condition: patientCondition,
          status: patientStatus,
        }),
      });
      if (!patientRes.ok) throw new Error(await patientRes.text());
      const patientData = await patientRes.json();
      const patientId = patientData.patient_id;

      // Link doctor to department if selected
      if (selectedDoctorId && selectedDepartmentId) {
        const linkRes = await fetch(`${URL}/api/doctor_department`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctor_id: selectedDoctorId,
            department_id: selectedDepartmentId,
          }),
        });
        if (!linkRes.ok) throw new Error(await linkRes.text());
      }

      // Create Appointment
      if (appointmentDate && selectedDoctorId) {
        const appointmentRes = await fetch(`${URL}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patientId,
            doctor_id: selectedDoctorId,
            appointment_date: new Date(appointmentDate).toISOString(),
          }),
        });
        if (!appointmentRes.ok) throw new Error(await appointmentRes.text());
      }

      // Create Treatment and Patient-Treatment
      if (treatmentName && treatmentCost) {
        const treatmentRes = await fetch(`${URL}/api/treatments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            treatment_name: treatmentName,
            cost: parseFloat(treatmentCost),
          }),
        });
        if (!treatmentRes.ok) throw new Error(await treatmentRes.text());
        const treatmentData = await treatmentRes.json();
        const treatmentId = treatmentData.id;

        await fetch(`${URL}/api/patient_treatments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patientId,
            treatment_id: treatmentId,
            date_given: new Date().toISOString().slice(0, 10),
          }),
        });
      }

      // Create Bill
      if (billAmount) {
        await fetch(`${URL}/api/bills`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patientId,
            amount: parseFloat(billAmount),
            bill_date: new Date().toISOString().slice(0, 10),
            status: billStatus,
          }),
        });
      }

      alert("Patient and related records created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Create New Patient</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={patientPhone}
          onChange={(e) => setPatientPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Gender"
          value={patientGender}
          onChange={(e) => setPatientGender(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Condition"
          value={patientCondition}
          onChange={(e) => setPatientCondition(e.target.value)}
          required
        />

        <label>Status:</label>
        <select
          value={patientStatus}
          onChange={(e) => setPatientStatus(e.target.value)}
          required
        >
          <option value="Admitted">Admitted</option>
          <option value="Discharged">Discharged</option>
        </select>

        <label>Doctor:</label>
        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.doctor_id} value={doc.doctor_id}>
              {doc.doctor_name} ({doc.doctor_specialty})
            </option>
          ))}
        </select>

        <label>Department:</label>
        <select
          value={selectedDepartmentId}
          onChange={(e) => setSelectedDepartmentId(e.target.value)}
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept.department_id} value={dept.department_id}>
              {dept.department_name}
            </option>
          ))}
        </select>

        <label>Appointment Date:</label>
        <input
          type="datetime-local"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Treatment Name"
          value={treatmentName}
          onChange={(e) => setTreatmentName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Treatment Cost"
          value={treatmentCost}
          onChange={(e) => setTreatmentCost(e.target.value)}
        />

        <input
          type="number"
          placeholder="Bill Amount"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
        />
        <label>Bill Status:</label>
        <select value={billStatus} onChange={(e) => setBillStatus(e.target.value)}>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>

        <button type="submit">Create Patient</button>
      </form>
    </div>
  );
}

export default Create;