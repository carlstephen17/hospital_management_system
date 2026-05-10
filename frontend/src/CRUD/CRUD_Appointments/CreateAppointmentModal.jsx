import React, { useState, useEffect } from "react";
import { URL } from "../../API";
import { modalStyles as ms } from "../../components/SideBar";

function Field({ label, required, hint, children }) {
  return (
    <div style={ms.formGroup}>
      <label style={ms.label}>
        {label}
        {required && (
          <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
        )}
      </label>
      {children}
      {hint && (
        <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

export default function CreateAppointmentModal({ onClose, onSaved }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "Scheduled",
    type: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${URL}/api/patients`)
      .then((r) => r.json())
      .then((d) => setPatients(Array.isArray(d) ? d : []))
      .catch(console.error);
    fetch(`${URL}/api/doctors`)
      .then((r) => r.json())
      .then((d) => setDoctors(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    const { patient_id, doctor_id, appointment_date, appointment_time } = form;
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      setError("Patient, Doctor, Date and Time are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create appointment");
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
          <span style={ms.title}>Create Appointment</span>
          <button style={ms.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={ms.body}>
          {error && <div style={ms.errBox}>⚠ {error}</div>}

          <Field
            label="Patient"
            required
            hint="Only registered patients appear here"
          >
            <select
              style={ms.select}
              value={form.patient_id}
              onChange={set("patient_id")}
            >
              <option value="">— Select a patient —</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.patient_id} · {p.patient_name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Doctor"
            required
            hint="Only registered doctors appear here"
          >
            <select
              style={ms.select}
              value={form.doctor_id}
              onChange={set("doctor_id")}
            >
              <option value="">— Select a doctor —</option>
              {doctors.map((d) => (
                <option key={d.doctor_id} value={d.doctor_id}>
                  {d.doctor_id} · {d.doctor_name} — {d.doctor_specialty}
                </option>
              ))}
            </select>
          </Field>

          <div style={ms.grid2}>
            <Field label="Date" required>
              <input
                style={ms.input}
                type="date"
                value={form.appointment_date}
                onChange={set("appointment_date")}
              />
            </Field>
            <Field label="Time" required>
              <input
                style={ms.input}
                type="time"
                value={form.appointment_time}
                onChange={set("appointment_time")}
              />
            </Field>
          </div>

          <div style={ms.grid2}>
            <Field label="Status">
              <select
                style={ms.select}
                value={form.status}
                onChange={set("status")}
              >
                <option>Scheduled</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </Field>
            <Field label="Type / Purpose">
              <input
                style={ms.input}
                placeholder="e.g. Check-up, Follow-up"
                value={form.type}
                onChange={set("type")}
              />
            </Field>
          </div>

          <Field label="Notes / Remarks">
            <textarea
              style={{ ...ms.input, resize: "none" }}
              rows={3}
              placeholder="Additional notes..."
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
            {saving ? "Saving…" : "Save Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}
