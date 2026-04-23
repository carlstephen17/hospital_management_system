import React, { useEffect, useState } from "react";
import { URL } from "../API";
import { useNavigate } from "react-router-dom";

function Bills() {
  const [difference, setDifference] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    try {
      const response = await fetch(`${URL}/api/reports/difference`);
      const data = await response.json();
      setDifference(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(billId) {
    if (!billId) {
      alert("No bill exists to delete");
      return;
    }

    try {
      const response = await fetch(`${URL}/api/bills/${billId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      fetchBills();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  }

  return (
    <div>
      <h1>Bills</h1>
      <h3>SET DIFFERENCE</h3>
      <p>Patients with Appointment but are UNPAID</p>

      <button onClick={() => navigate('/')} >Back to Home</button>
      <button onClick={() => navigate("/createBills")}>
        Create +
      </button>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Bill Status</th>
            <th>Bill Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {difference.length === 0 ? (
            <tr>
              <td colSpan="5">No data yet.</td>
            </tr>
          ) : (
            difference.map((row) => (
              <tr key={row.bill_id || row.patient_id}>
                <td>{row.patient_id}</td>
                <td>{row.patient_name}</td>
                <td>{row.status}</td>
                <td>{row.bill_date}</td>

                <td>
                  <button
                    onClick={() => {
                      if (!row.bill_id) {
                        alert("No bill exists for this patient");
                        return;
                      }
                      navigate(`/readBills/${row.bill_id}`);
                    }}
                  >
                    Read
                  </button>

                  <button
                    onClick={() => {
                      if (!row.bill_id) {
                        alert("No bill exists for this patient");
                        return;
                      }
                      navigate(`/editBills/${row.bill_id}`);
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDelete(row.bill_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Bills;