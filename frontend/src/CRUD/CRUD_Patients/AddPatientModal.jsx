import React, { useState } from "react";
import { URL } from "../../API"; 

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.5)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  borderRadius: "14px",
  width: "480px",
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "90vh",
  overflowY: "auto",
};

const inp = {
  padding: "8px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#0f172a",
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
  width: "100%",
};

const lbl = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

function AddPatientModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    patient_name: "",
    phone: "",
    gender: "",
    dob: "",
    blood_type: "",
    address: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSave() {
    const { patient_name, phone, gender, address } = form;

    if (!patient_name || !phone || !gender || !address) {
      setError("Name, Phone, Gender, and Address are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${URL}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save patient");

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={modal}>
        {/* HEADER */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: "700", fontSize: "17px" }}>
            Add New Patient
          </span>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: "20px 24px" }}>
          {error && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                background: "#fee2e2",
                color: "#b91c1c",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Full Name">
                <input
                  style={inp}
                  value={form.patient_name}
                  onChange={set("patient_name")}
                />
              </Field>
            </div>

            <Field label="Phone">
              <input
                style={inp}
                value={form.phone}
                onChange={set("phone")}
              />
            </Field>

            <Field label="Gender">
              <select
                style={inp}
                value={form.gender}
                onChange={set("gender")}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>

            <Field label="DOB">
              <input
                type="date"
                style={inp}
                value={form.dob}
                onChange={set("dob")}
              />
            </Field>

            <Field label="Blood Type">
              <select
                style={inp}
                value={form.blood_type}
                onChange={set("blood_type")}
              >
                <option value="">Select</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </Field>

            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Address">
                <input
                  style={inp}
                  value={form.address}
                  onChange={set("address")}
                />
              </Field>
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Notes">
                <textarea
                  style={{ ...inp, resize: "vertical" }}
                  value={form.notes}
                  onChange={set("notes")}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 14px",
              background: "#e2e8f0",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "8px 14px",
              background: "#1a56db",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPatientModal;