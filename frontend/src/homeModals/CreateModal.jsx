import React, { useState, useEffect } from "react";
import { URL } from "../API";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  width: "100%",
  maxWidth: "650px",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "14px",
  padding: "22px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const fullWidth = {
  gridColumn: "span 2",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "13px",
};

const btnRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "16px",
};

const btnCancel = {
  padding: "9px 14px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "#fff",
  cursor: "pointer",
};

const btnSubmit = {
  padding: "9px 14px",
  borderRadius: "8px",
  border: "none",
  background: "#1a56db",
  color: "#fff",
  cursor: "pointer",
};

function CreateModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);

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

  const genders = ["Male", "Female"];

  const statusList = [
    "Admitted",
    "Discharged",
    "Deceased",
    "Critical",
    "Recovered",
    "Inactive",
  ];

  useEffect(() => {
    async function fetchData() {
      const doctorRes = await fetch(`${URL}/api/doctors`);
      setDoctors(await doctorRes.json());

      const deptRes = await fetch(`${URL}/api/departments`);
      setDepartments(await deptRes.json());
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!patientName || !patientGender || !patientStatus) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

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

      const patientData = await patientRes.json();

      if (!patientData?.patient_id) {
        throw new Error("No patient ID returned");
      }

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
        await fetch(`${URL}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patientId,
            doctor_id: selectedDoctorId,
            appointment_date: appointmentDate.replace("T", " ") + ":00",
          }),
        });
      }

      if (treatmentName) {
        const tRes = await fetch(`${URL}/api/treatments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            treatment_name: treatmentName,
            cost: Number(treatmentCost) || 0,
          }),
        });

        const tData = await tRes.json();

        await fetch(`${URL}/api/patient_treatments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patientId,
            treatment_id: tData.id,
            date_given: new Date().toISOString().slice(0, 10),
          }),
        });
      }

      await fetch(`${URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          amount: Number(billAmount) || 0,
          bill_date: new Date().toISOString().slice(0, 10),
          status: billStatus,
        }),
      });

      alert("Patient created successfully!");

      onCreated?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Error creating patient");
    }

    setLoading(false);
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "14px" }}>Create Patient</h2>

        <form onSubmit={handleSubmit} style={gridStyle}>
          <input
            style={inputStyle}
            placeholder="Patient Name *"
            onChange={(e) => setPatientName(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Phone"
            onChange={(e) => setPatientPhone(e.target.value)}
          />

          <select
            style={inputStyle}
            onChange={(e) => setPatientGender(e.target.value)}
          >
            <option value="">Select Gender *</option>
            {genders.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          <select
            style={inputStyle}
            onChange={(e) => setPatientStatus(e.target.value)}
          >
            <option value="">Select Status *</option>
            {statusList.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            style={inputStyle}
            placeholder="Address"
            onChange={(e) => setPatientAddress(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Condition"
            onChange={(e) => setPatientCondition(e.target.value)}
          />

          <select
            style={inputStyle}
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
            style={inputStyle}
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
            style={inputStyle}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Treatment Name"
            onChange={(e) => setTreatmentName(e.target.value)}
          />

          <input
            type="number"
            style={inputStyle}
            placeholder="Treatment Cost"
            onChange={(e) => setTreatmentCost(e.target.value)}
          />

          <input
            type="number"
            style={inputStyle}
            placeholder="Bill Amount"
            onChange={(e) => setBillAmount(e.target.value)}
          />

          <select
            style={inputStyle}
            onChange={(e) => setBillStatus(e.target.value)}
          >
            <option>Unpaid</option>
            <option>Paid</option>
          </select>

          <div style={{ ...fullWidth, ...btnRow }}>
            <button type="button" style={btnCancel} onClick={onClose}>
              Cancel
            </button>

            <button type="submit" style={btnSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateModal;