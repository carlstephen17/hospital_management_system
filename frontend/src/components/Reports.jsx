import React, { useState } from "react";
import { URL } from "../API";
import { useNavigate } from "react-router-dom";

function Reports() {
  const navigate = useNavigate();

  const [cartesian, setCartesian] = useState([]);
  const [unionData, setUnionData] = useState([]);
  const [difference, setDifference] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReports = () => {
    setLoading(true);

    // 1. Cartesian Product
    fetch(`${URL}/api/reports/cartesian`)
      .then(res => res.json())
      .then(data => setCartesian(data))
      .catch(err => console.error("Cartesian error:", err));

    // 2. UNION
    fetch(`${URL}/api/reports/union`)
      .then(res => res.json())
      .then(data => setUnionData(data))
      .catch(err => console.error("Union error:", err));

    // 3. DIFFERENCE
    fetch(`${URL}/api/reports/difference`)
      .then(res => res.json())
      .then(data => setDifference(data))
      .catch(err => console.error("Difference error:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Advanced Reports (For Project Requirements)</h2>
      
      <button 
        onClick={loadReports} 
        disabled={loading}
        style={{ 
          padding: "12px 20px", 
          fontSize: "16px", 
          marginBottom: "30px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {loading ? "Loading..." : "Load Cartesian, UNION & DIFFERENCE Reports"}
      </button>

      <button 
        onClick={() => {
            navigate("/");        
        }}
        style={{ 
          padding: "12px 20px", 
          fontSize: "16px", 
          marginLeft: "10px",
          marginBottom: "30px",
          background: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Back to Home
      </button>

      <h3>1. Cartesian Product </h3>
      <p>Doctors × Patients (with condition)</p>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "40px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Doctor Name</th>
            <th>Patient Name</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {cartesian.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>No data yet. Click the button above.</td></tr>
          ) : (
            cartesian.map((row, index) => (
              <tr key={index}>
                <td>{row.doctor_name}</td>
                <td>{row.patient_name}</td>
                <td>{row.condition}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>2. UNION </h3>
      <p>Patients who had Treatment</p>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "40px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Treatment</th>
          </tr>
        </thead>
        <tbody>
          {unionData.length === 0 ? (
            <tr><td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>No data yet. Click the button above.</td></tr>
          ) : (
            unionData.map((row, index) => (
              <tr key={index}>
                <td>{row["patient_id"]}</td>
                <td>{row.patient_name}</td>
                <td>{row.treatment_name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>3. SET DIFFERENCE </h3>
      <p>Patients with Appointment but are UNPAID</p>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Bill Status</th>
          </tr>
        </thead>
        <tbody>
          {difference.length === 0 ? (
            <tr><td style={{ textAlign: "center", padding: "20px" }}>No data yet. Click the button above.</td></tr>
          ) : (
            difference.map((row, index) => (
              <tr key={index}>
                <td>{row["patient_id"]}</td>
                <td>{row.patient_name}</td>
                <td>{row.status || "Unpaid"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;