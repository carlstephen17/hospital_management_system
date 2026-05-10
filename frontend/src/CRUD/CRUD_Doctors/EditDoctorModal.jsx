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

export default function EditDoctorModal({ doctor, onClose, onSaved }) {
  const [form, setForm] = useState({
    doctor_name: doctor.doctor_name || "",
    phone: doctor.phone || "",
    doctor_specialty: doctor.doctor_specialty || "",
    department_id: doctor.department_id || "",
    email: doctor.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    const { doctor_name, phone, doctor_specialty, email } = form;
    if (!doctor_name || !phone || !doctor_specialty || !email) {
      setError("Name, Phone, Specialization, and Email are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${URL}/api/doctors/${doctor.doctor_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update doctor");
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
          <span style={ms.title}>Edit Doctor</span>
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
                value={form.doctor_name}
                onChange={set("doctor_name")}
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
            <Field label="Specialization" required>
              <input
                style={ms.input}
                value={form.doctor_specialty}
                onChange={set("doctor_specialty")}
              />
            </Field>
            <Field label="Department ID">
              <input
                style={ms.input}
                value={form.department_id}
                onChange={set("department_id")}
              />
            </Field>
          </div>
          <div style={ms.grid2}>
            <Field label="Email" required>
              <input
                style={ms.input}
                type="email"
                value={form.email}
                onChange={set("email")}
              />
            </Field>
          </div>
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
