import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { URL } from "../API";

function EditBills() {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState("");
  const [amount, setAmount] = useState("");
  const [billDate, setBillDate] = useState("");
  const [billStatus, setBillStatus] = useState("unpaid");
  const [loading, setLoading] = useState(true);

  const fetchBill = useCallback(async () => {
    if (!billId || billId === "null" || billId === "undefined") {
      alert("No bill record found to edit. Please create a bill first.");
      navigate("/bills");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${URL}/api/bills/${billId}`);
      
      if (!res.ok) {
        throw new Error("Bill not found in database");
      }

      const data = await res.json();

      setPatientName(data?.patient_name || "");
      setAmount(data?.amount || "");
      setBillDate(data?.bill_date ? data.bill_date.split("T")[0] : "");
      setBillStatus(data?.status || "unpaid");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
      navigate("/bills");
    } finally {
      setLoading(false);
    }
  }, [billId, navigate]);

  useEffect(() => {
    fetchBill();
  }, [fetchBill]);

  async function handleEdit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/api/bills/${billId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName,
          amount: parseFloat(amount),
          bill_date: billDate,
          status: billStatus, 
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Bill updated successfully!");
      navigate("/bills"); 
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  }

  if (loading) return <div style={{ padding: "20px" }}>Loading Bill Details...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <button onClick={() => navigate("/bills")}>← Back to Bills</button>
      <form onSubmit={handleEdit} style={{ marginTop: "20px" }}>
        <h2>Edit Bill #{billId}</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
          <label>
            Patient Name:
            <input 
              style={{ width: "100%", padding: "8px" }}
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)} 
              required 
            />
          </label>

          <label>
            Amount (₱):
            <input 
              style={{ width: "100%", padding: "8px" }}
              value={amount} 
              type="number" 
              step="0.01"
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
          </label>

          <label>
            Bill Date:
            <input 
              style={{ width: "100%", padding: "8px" }}
              value={billDate} 
              type="date" 
              onChange={(e) => setBillDate(e.target.value)} 
              required 
            />
          </label>

          <label>
            Payment Status:
            <select 
              style={{ width: "100%", padding: "8px" }}
              value={billStatus} 
              onChange={(e) => setBillStatus(e.target.value)}
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </label>

          <button 
            type="submit" 
            style={{ padding: "10px", background: "#1a56db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Update Everything
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBills;