import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { URL } from "../../API";

function CreateBills() {
  const navigate = useNavigate();
  const location = useLocation();

  const patient = location.state?.patient;

  const [formData, setFormData] = useState({
    patient_id: patient?.patient_id || "",
    amount: "",
    bill_date: "",
    status: "Unpaid",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${URL}/api/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create bill");
      }

      alert("Bill created successfully");

      navigate("/bills");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Bill</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "400px",
        }}
      >
        <input
          type="number"
          name="patient_id"
          placeholder="Patient ID"
          value={formData.patient_id}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="bill_date"
          value={formData.bill_date}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <button
          type="submit"
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create Bill
        </button>

        <button
          type="button"
          onClick={() => navigate("/bills")}
          style={{
            background: "#6b7280",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreateBills;