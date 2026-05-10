import React, { useState } from "react";
import { URL } from "../../API";
import { modalStyles as ms } from "../../components/SideBar";

function Field({ label, required, children }) {
  return (
    <div style={ms.formGroup}>
      <label style={ms.label}>
        {label}
        {required && (
          <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}

export default function EditPatientModal({ patient, onClose, onSaved }) {
  const [form, setForm] = useState({
    patient_name: patient.patient_name || "",
    phone: patient.phone || "",
    gender: patient.gender || "",
    dob: patient.dob || "",
    blood_type: patient.blood_type || "",
    address: patient.address || "",
    notes: patient.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    const { patient_name, phone, gender, address } = form;
    if (!patient_name || !phone || !gender || !address) {
      setError("Name, Phone, Gender, and Address are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${URL}/api/patients/${patient.patient_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update patient");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={ms.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={ms.modal}>
        <div style={ms.header}>
          <span style={ms.title}>Edit Patient</span>
          <button style={ms.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={ms.body}>
          {error && <div style={ms.errBox}>⚠ {error}</div>}
          <div style={ms.grid2}>
            <Field label="Full Name" required>
              <input
                style={ms.input}
                value={form.patient_name}
                onChange={set("patient_name")}
              />
            </Field>
            <Field label="Phone" required>
              <input
                style={ms.input}
                value={form.phone}
                onChange={set("phone")}
              />
            </Field>
          </div>
          <div style={ms.grid2}>
            <Field label="Gender" required>
              <select
                style={ms.select}
                value={form.gender}
                onChange={set("gender")}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Date of Birth">
              <input
                style={ms.input}
                type="date"
                value={form.dob}
                onChange={set("dob")}
              />
            </Field>
          </div>
          <div style={ms.grid2}>
            <Field label="Blood Type">
              <select
                style={ms.select}
                value={form.blood_type}
                onChange={set("blood_type")}
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Address" required>
              <input
                style={ms.input}
                value={form.address}
                onChange={set("address")}
              />
            </Field>
          </div>
          <Field label="Medical Notes">
            <textarea
              style={{ ...ms.input, resize: "none" }}
              rows={3}
              value={form.notes}
              onChange={set("notes")}
            />
          </Field>
        </div>
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
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
