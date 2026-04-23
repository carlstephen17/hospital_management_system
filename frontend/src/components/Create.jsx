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
  const [patientStatus, setPatientStatus] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentCost, setTreatmentCost] = useState("");

  const [billAmount, setBillAmount] = useState("");
  const [billStatus, setBillStatus] = useState("Unpaid");

  const [genders, setGenders] = useState([]);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const doctorRes = await fetch(`${URL}/api/doctors`);
        setDoctors(await doctorRes.json());

        const deptRes = await fetch(`${URL}/api/departments`);
        setDepartments(await deptRes.json());

        fetchGender();
        fetchStatus();
      } catch (err) {
        console.error("Error loading selection data:", err);
      }
    }

    fetchData();
  }, []);

  async function fetchGender() {
    try {
      const res = await fetch(`${URL}/api/patient/gender`);
      const data = await res.json();

      if (res.ok) {
        const list = [...new Set(data.map((r) => r.gender))];
        setGenders(list);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStatus() {
    try {
      const res = await fetch(`${URL}/api/patient/status`);
      const data = await res.json();

      if (res.ok) {
        const list = [...new Set(data.map((r) => r.status))];
        setStatusList(list);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const costNum = parseFloat(treatmentCost) || 0;
    const billNum = parseFloat(billAmount) || 0;

    try {
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

      if (!patientRes.ok) throw new Error("Failed to create patient");

      const patientData = await patientRes.json();
      const patientId = patientData.patient_id;

      if (selectedDoctorId && selectedDepartmentId) {
        await fetch(`${URL}/api/doctor_department`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctor_id: selectedDoctorId,
            department_id: selectedDepartmentId,
          }),
        });
      }

      if (appointmentDate && selectedDoctorId) {
        const formattedDate = appointmentDate.replace("T", " ") + ":00";

        await fetch(`${URL}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patientId,
            doctor_id: selectedDoctorId,
            appointment_date: formattedDate,
          }),
        });
      }

      const treatmentRes = await fetch(`${URL}/api/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatment_name: treatmentName,
          cost: costNum,
        }),
      });

      const treatmentData = await treatmentRes.json();

      await fetch(`${URL}/api/patient_treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          treatment_id: treatmentData.id,
          date_given: new Date().toISOString().slice(0, 10),
        }),
      });

      await fetch(`${URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          amount: billNum,
          bill_date: new Date().toISOString().slice(0, 10),
          status: billStatus,
        }),
      });

      alert("Record created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error creating record");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create New Patient</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "500px",
        }}
      >
        <input
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={patientPhone}
          onChange={(e) => setPatientPhone(e.target.value)}
        />

        {/* ✅ GENDER (FIXED - SAME AS EDIT STYLE) */}
        <select
          value={patientGender}
          onChange={(e) => setPatientGender(e.target.value)}
        >
          <option value="">Select Gender</option>

          {genders.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <input
          placeholder="Address"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
        />

        <input
          placeholder="Condition"
          value={patientCondition}
          onChange={(e) => setPatientCondition(e.target.value)}
        />

        {/* STATUS */}
        <select
          value={patientStatus}
          onChange={(e) => setPatientStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          {statusList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.doctor_id} value={d.doctor_id}>
              {d.doctor_name}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartmentId}
          onChange={(e) => setSelectedDepartmentId(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />

        <input
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

        <select
          value={billStatus}
          onChange={(e) => setBillStatus(e.target.value)}
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
        <button onClick={() => {navigate("/")}}> Cancel </button>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default Create;