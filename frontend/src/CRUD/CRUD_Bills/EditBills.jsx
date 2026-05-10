import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { URL } from "../../API";

function EditBills() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState({
    patient_id: "",
    amount: "",
    bill_date: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchBill = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${URL}/api/bills`);

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }

      const data = await response.json();

      const currentBill = data.find(
        (b) => String(b.bill_id) === String(id)
      );

      if (currentBill) {
        setBill({
          patient_id: currentBill.patient_id || "",
          amount: currentBill.amount || "",
          bill_date: currentBill.bill_date
            ? currentBill.bill_date.split("T")[0]
            : "",
          status: currentBill.status || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBill();
  }, [fetchBill]);

  const handleChange = (e) => {
    setBill({
      ...bill,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${URL}/api/bills/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bill),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bill");
      }

      alert("Bill updated successfully");

      navigate("/bills");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Bill</h1>

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
          value={bill.patient_id}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={bill.amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="bill_date"
          value={bill.bill_date}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={bill.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Update Bill
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

export default EditBills;