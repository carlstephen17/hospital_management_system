import React, { useState, useEffect } from "react";
import { URL } from "../../API";
import { modalStyles as ms } from "../../components/SideBar";

function Field({ label, children }) {
  return (
    <div style={ms.formGroup}>
      <label style={ms.label}>{label}</label>
      {children}
    </div>
  );
}

export default function CreateBillModal({ onClose, onSaved }) {
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patient_id: "",
    treatment_id: "",
    amount: "",
    bill_date: "",
    status: "Unpaid",
    blood_type: "",
  });

  // VALID VALUES
  const validBloodTypes = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  const validStatuses = ["Unpaid", "Paid", "Pending"];

  const computeBillStatus = (amount, treatmentId) => {
    const amountValue = String(amount ?? "").trim();
    const numericAmount = Number(amountValue);
    const selectedTreatment = treatments.find(
      (t) => String(t.treatment_id) === String(treatmentId)
    );
    const treatmentCost =
      selectedTreatment?.cost !== undefined
        ? Number(selectedTreatment.cost)
        : null;

    if (!amountValue) {
      return "Unpaid";
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return "Pending";
    }

    if (
      treatmentCost !== null &&
      !Number.isNaN(treatmentCost) &&
      numericAmount >= treatmentCost
    ) {
      return "Paid";
    }

    return "Pending";
  };

  useEffect(() => {
    fetch(`${URL}/api/patients`)
      .then((r) => r.json())
      .then((d) => setPatients(Array.isArray(d) ? d : []))
      .catch(console.error);

    fetch(`${URL}/api/treatments`)
      .then((r) => r.json())
      .then((d) => setTreatments(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, []);

  const selectedTreatment = treatments.find(
    (t) => String(t.treatment_id) === String(form.treatment_id)
  );

  const treatmentCost = selectedTreatment?.cost ?? "";

  const set = (k) => (e) => {
    const value = e.target.value;

    setForm((f) => {
      const updated = { ...f, [k]: value };

      if (k === "treatment_id") {
        const selected = treatments.find(
          (t) => String(t.treatment_id) === String(value)
        );

        if (selected?.cost) {
          updated.amount = selected.cost;
        }
      }

      if (k === "treatment_id" || k === "amount") {
        updated.status = computeBillStatus(
          updated.amount,
          updated.treatment_id
        );
      }

      return updated;
    });
  };

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      // 🔥 VALIDATION CONDITIONS

      if (!form.patient_id || !form.bill_date) {
        setError("Patient and Date are required.");
        return;
      }

      if (
        form.amount &&
        Number.isNaN(Number(String(form.amount).trim()))
      ) {
        setError("Amount must be a valid number.");
        return;
      }

      if (
        form.blood_type &&
        !validBloodTypes.includes(form.blood_type)
      ) {
        setError("Invalid blood type selected.");
        return;
      }

      const payload = {
        patient_id: form.patient_id,
        treatment_id: form.treatment_id || null,
        amount: form.amount ? parseFloat(form.amount) : null,
        bill_date: form.bill_date,
        status: computeBillStatus(form.amount, form.treatment_id),
        blood_type: form.blood_type || null,
      };

      console.log("Payload:", payload);

      const res = await fetch(`${URL}/api/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to create bill."
        );
      }

      if (onSaved) onSaved(data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={ms.overlay}
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div style={ms.modal}>
        {/* HEADER */}
        <div style={ms.header}>
          <span style={ms.title}>Create Bill</span>
          <button style={ms.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div style={ms.body}>
          {error && <div style={ms.errBox}>⚠ {error}</div>}

          <Field label="Patient">
            <select style={ms.select} value={form.patient_id} onChange={set("patient_id")}>
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.patient_id} · {p.patient_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Treatment">
            <select style={ms.select} value={form.treatment_id} onChange={set("treatment_id")}>
              <option value="">Optional treatment</option>
              {treatments.map((t) => (
                <option key={t.treatment_id} value={t.treatment_id}>
                  {t.treatment_id} - {t.treatment_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Treatment Cost (₱)">
            <input
              style={ms.input}
              type="text"
              value={treatmentCost !== "" ? treatmentCost : ""}
              disabled
              placeholder="No treatment selected"
            />
          </Field>

          <Field label="Blood Type">
            <select
              style={ms.select}
              value={form.blood_type}
              onChange={set("blood_type")}
            >
              <option value="">Select blood type</option>
              {validBloodTypes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <div style={ms.grid2}>
            <Field label="Amount">
              <input
                style={ms.input}
                type="number"
                value={form.amount}
                onChange={set("amount")}
              />
            </Field>

            <Field label="Bill Date">
              <input
                style={ms.input}
                type="date"
                value={form.bill_date}
                onChange={set("bill_date")}
              />
            </Field>
          </div>

          <Field label="Status (auto)">
            <select
              style={ms.select}
              value={form.status}
              disabled
            >
              {validStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* FOOTER */}
        <div style={ms.footer}>
          <button style={ms.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={{
              ...ms.saveBtn,
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}