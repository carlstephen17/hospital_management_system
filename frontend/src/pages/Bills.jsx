import React, { useEffect, useState } from "react";
import { URL } from "../API";
import { useNavigate } from "react-router-dom";

function Bills() {
  const [difference, setDifference] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    try {
      setLoading(true);
      const response = await fetch(`${URL}/api/reports/difference`);
      if (!response.ok) throw new Error("Failed to fetch bills");
      const data = await response.json();
      setDifference(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bills Management</h1>
      <button onClick={() => navigate("/")}>Back to Dashboard</button>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {difference.map((row) => (
            <tr key={row.patient_id}>
              <td>{row.patient_id}</td>
              <td>{row.patient_name}</td>
              <td style={{ color: row.bill_id ? "red" : "gray" }}>
                {row.status}
              </td>
              <td>
                {row.bill_id ? (
                  <>
                    <button onClick={() => navigate(`/editBills/${row.bill_id}`)}>
                      ✏️ Edit Bill
                    </button>
                  </>
                ) : (
                  <button 
                    style={{ background: "#10b981", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                    onClick={() => navigate("/createBills", { state: { patient: row } })}
                  >
                    ➕ Create Bill
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bills;