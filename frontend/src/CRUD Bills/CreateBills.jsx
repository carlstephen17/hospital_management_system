import React, { useState } from "react";
import { URL } from "../API";
import { useNavigate } from "react-router-dom";

function CreateBills() {
  const [patientName, setPatientName] = useState("");
  const [billStatus, setBillStatus] = useState("Unpaid");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const patientRes = await fetch(`${URL}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName,
        }),
      });

      if (!patientRes.ok) {
        throw new Error("Failed to create patient");
      }

      const patientData = await patientRes.json();

      const billRes = await fetch(`${URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientData.patient_id,
          status: billStatus,
        }),
      });

      if (!billRes.ok) {
        throw new Error("Failed to create bill");
      }

      alert("Bill created successfully!");
      setPatientName("");
      setBillStatus("Unpaid");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />

        <select
          value={billStatus}
          onChange={(e) => setBillStatus(e.target.value)}
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>

        <button type="button" onclick={navigate("/")}>
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateBills;
