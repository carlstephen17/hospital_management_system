import React, { useState } from "react";
import { URL } from "../API";
import { useNavigate } from "react-router-dom";

function CreateBills() {
  const [patientName, setPatientName] = useState("");
  const [amount, setAmount] = useState("");
  const [billDate, setBillDate] = useState(new Date().toISOString().split("T")[0]);
  const [billStatus, setBillStatus] = useState("unpaid");
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

      if (!patientRes.ok) throw new Error("Failed to create patient");
      const patientData = await patientRes.json();

      const billRes = await fetch(`${URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientData.patient_id,
          patient_name: patientName,
          amount: parseFloat(amount) || 0,
          bill_date: billDate,
          status: billStatus,
        }),
      });

      if (!billRes.ok) throw new Error("Failed to create bill");

      alert("Bill created successfully!");
      navigate("/bills");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create New Bill Record</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
        <label>Patient Name</label>
        <input
          type="text"
          placeholder="Enter Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />

        <label>Amount (₱)</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Bill Date</label>
        <input
          type="date"
          value={billDate}
          onChange={(e) => setBillDate(e.target.value)}
          required
        />

        <label>Status</label>
        <select
          value={billStatus}
          onChange={(e) => setBillStatus(e.target.value)}
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" style={{ background: "#1a56db", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Create Bill
          </button>
          <button type="button" onClick={() => navigate("/bills")} style={{ padding: "8px 16px", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBills;