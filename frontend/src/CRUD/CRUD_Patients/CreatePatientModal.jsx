import React, { useState } from "react";
import { URL } from "../../API";
import { modalStyles as ms, MODAL_CSS } from "../../components/SideBar";

function Field({ label, required, children }) {
  return (
    <div style={ms.fieldWrap}>
      <label style={ms.label}>
        {label}
        {required && <span style={ms.requiredDot}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function CreatePatientModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    patient_name: "",
    phone: "",
    gender: "",
    blood_type: "",
    medical_condition: "",
    status: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const medicalConditions = [
    "Hypertension",
    "Diabetes",
    "Asthma",
    "Heart Disease",
    "Cancer",
    "Arthritis",
    "Depression",
    "Anxiety",
    "Migraine",
    "Allergies",
    "Other",
  ];

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSave() {
    const { patient_name, phone, gender, blood_type, medical_condition, status, address } = form;

    if (
      !patient_name.trim() || !phone.trim() || !gender ||
      !blood_type || !medical_condition.trim() || !status || !address.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must start with '09' and be exactly 11 digits.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // ✅ Explicit payload — every field intentionally included
      const payload = {
        patient_name:      patient_name.trim(),
        phone:             phone.trim(),
        gender,
        blood_type,
        medical_condition: medical_condition.trim(),
        status,
        address:           address.trim(),
      };

      const res = await fetch(`${URL}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try { data = await res.json(); } catch (_) {}

      if (!res.ok) throw new Error(data.message || "Failed to save patient");

      if (onSaved) await onSaved(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <style>{MODAL_CSS}</style>
      <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="pm-modal" style={ms.modal}>

          {/* HEADER */}
          <div style={ms.header}>
            <div style={ms.titleRow}>
              <div style={ms.titleIcon}>🧑‍⚕️</div>
              <h2 style={ms.title}>Add New Patient</h2>
            </div>
            <button className="pm-close" style={ms.closeBtn} onClick={onClose}>✕</button>
          </div>

          {/* BODY */}
          <div style={ms.body}>
            {error && <div style={ms.errBox}><span>⚠</span> {error}</div>}

            {/* Row 1 — Name + Phone */}
            <div style={ms.row}>
              <Field label="Full Name" required>
                <input
                  className="pm-input"
                  style={ms.input}
                  value={form.patient_name}
                  onChange={set("patient_name")}
                  placeholder="e.g. Maria Santos"
                />
              </Field>
              <Field label="Phone" required>
                <input
                  className="pm-input"
                  style={ms.input}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+63 912 345 6789"
                />
              </Field>
            </div>

            {/* Row 2 — Gender + Blood Type */}
            <div style={ms.row}>
              <Field label="Gender" required>
                <select className="pm-input" style={ms.input} value={form.gender} onChange={set("gender")}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Field>
              <Field label="Blood Type" required>
                <select className="pm-input" style={ms.input} value={form.blood_type} onChange={set("blood_type")}>
                  <option value="">Select type</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Row 3 — Medical Condition + Status */}
            <div style={ms.row}>
              <Field label="Medical Condition" required>
                <select className="pm-input" style={ms.input} value={form.medical_condition} onChange={set("medical_condition")}>
                  <option value="">Select condition</option>
                  {medicalConditions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status" required>
                <select className="pm-input" style={ms.input} value={form.status} onChange={set("status")}>
                  <option value="">Select status</option>
                  {["Admitted","Discharged","Deceased","Critical","Recovered","Inactive"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Full row — Address */}
            <div style={ms.fullRow}>
              <Field label="Address" required>
                <input
                  className="pm-input"
                  style={ms.input}
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Street, City, Province"
                />
              </Field>
            </div>
          </div>

          {/* FOOTER */}
          <div style={ms.footer}>
            <button className="pm-cancel" style={ms.cancelBtn} onClick={onClose}>Cancel</button>
            <button className="pm-save" style={ms.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Patient"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}