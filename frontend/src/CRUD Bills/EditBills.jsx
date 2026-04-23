import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { URL } from "../API";

function EditBills() {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState("");
  const [amount, setAmount] = useState("");
  const [billDate, setBillDate] = useState("");
  const [billStatus, setBillStatus] = useState("unpaid");

  useEffect(() => {
    fetchBill();
  }, [billId]);

  async function fetchBill() {
    try {
      const res = await fetch(`${URL}/api/bills/${billId}`);
      const data = await res.json();

      const result = Array.isArray(data) ? data[0] : data;

      setPatientName(result?.patient_name || "");
      setAmount(result?.amount || "");
      setBillDate(result?.bill_date || "");
      setBillStatus(result?.status || "unpaid");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleEdit(e) {
    e.preventDefault();

    try {
      await fetch(`${URL}/api/bills/full/${billId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName,
          amount,
          bill_date: billDate,
          status: billStatus,
        }),
      });

      navigate("/bills");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  return (
    <form onSubmit={handleEdit}>
      <h2>Edit Full Record</h2>

      <input
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        placeholder="Patient Name"
      />

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        type="number"
      />

      <input
        value={billDate}
        onChange={(e) => setBillDate(e.target.value)}
        type="date"
      />

      <select
        value={billStatus}
        onChange={(e) => setBillStatus(e.target.value)}
      >
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>

      <button type="submit">Update Everything</button>
    </form>
  );
}

export default EditBills;