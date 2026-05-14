import React, { useState, useEffect } from "react";
import { URL } from "../../API";
import { modalStyles as ms } from "../../components/SideBar";

function Field({ label, required, children }) {
  return (
    <div style={ms.formGroup}>
      <label style={ms.label}>
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function CreateAppointmentModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_type: "",
    appointment_date: new Date().toISOString().slice(0,16),
    status: "Admitted",
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const appointmentTypes = [
    "Consultation",
    "Follow-up",
    "Check-up",
    "Emergency",
    "Laboratory",
    "Vaccination",
    "Surgery",
    "Therapy",
  ];

  const statuses = [
    "Admitted",
    "Discharged",
    "Deceased",
    "Critical",
    "Recovered",
  ];

  useEffect(() => {
    async function load() {
      const [pRes, dRes] = await Promise.all([
        fetch(`${URL}/api/patients`),
        fetch(`${URL}/api/doctors`),
      ]);

      setPatients(await pRes.json());
      setDoctors(await dRes.json());
    }

    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSave() {
    const { patient_id, doctor_id, appointment_type, appointment_date } = form;

    if (!patient_id || !doctor_id || !appointment_type || !appointment_date) {
      setError("All fields are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch(`${URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create appointment");

      onSaved?.();
      onClose();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        <div style={ms.header}>
          <span style={ms.title}>Create Appointment</span>
          <button style={ms.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={ms.body}>
          {error && <div style={ms.errBox}>⚠ {error}</div>}

          {/* ROW 1 */}
          <div style={ms.grid2}>
            <Field label="Patient" required>
              <select
                style={ms.select}
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.patient_id} - {p.patient_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Doctor" required>
              <select
                style={ms.select}
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.doctor_id} value={d.doctor_id}>
                    {d.doctor_id} - {d.doctor_name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* ROW 2 */}
          <div style={ms.grid2}>
            <Field label="Type / Purpose" required>
              <select
                style={ms.select}
                name="appointment_type"
                value={form.appointment_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                {appointmentTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>

            <Field label="Date & Time" required>
              <input
                type="datetime-local"
                style={ms.input}
                name="appointment_date"
                value={form.appointment_date}
                onChange={handleChange}
              />
            </Field>
          </div>

          {/* ROW 3 */}
          <div style={ms.grid2}>
            <Field label="Status">
              <select
                style={ms.select}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div style={ms.footer}>
          <button style={ms.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={ms.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}