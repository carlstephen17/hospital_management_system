import React, { useEffect, useState } from "react";
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

export default function EditAppointmentModal({ appointment, onClose, onSaved }) {
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_type: "",
    appointment_date: "",
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

  const defaultStatusOptions = [
    "Admitted",
    "Discharged",
    "Deceased",
    "Critical",
    "Recovered",
  ];

  const statusOptions = Array.from(
    new Set([
      ...(appointment?.status ? [appointment.status] : []),
      ...defaultStatusOptions,
    ]),
  );

  useEffect(() => {
    if (appointment) {
      setForm({
        patient_id: appointment.patient_id || "",
        doctor_id: appointment.doctor_id || "",
        appointment_type: appointment.appointment_type || "",
        appointment_date: appointment.appointment_date || "",
        status: appointment.status ?? "Admitted",
      });
    }
  }, [appointment]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, dRes] = await Promise.all([
          fetch(`${URL}/api/patients`),
          fetch(`${URL}/api/doctors`),
        ]);

        setPatients(await pRes.json());
        setDoctors(await dRes.json());
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      // 🔥 DEBUG (remove later if needed)
      console.log("SENDING UPDATE:", form);

      const res = await fetch(
        `${URL}/api/appointments/${appointment.appointment_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to update appointment");
      }

      onSaved?.(data);
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
          <span style={ms.title}>Edit Appointment</span>
          <button style={ms.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={ms.body}>
          {error && <div style={ms.errBox}>⚠ {error}</div>}

          {/* Patient + Doctor */}
          <div style={ms.grid2}>
            <Field label="Patient" required>
              <select style={ms.select} name="patient_id" value={form.patient_id} onChange={handleChange}>
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.patient_id} - {p.patient_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Doctor" required>
              <select style={ms.select} name="doctor_id" value={form.doctor_id} onChange={handleChange}>
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.doctor_id} value={d.doctor_id}>
                    {d.doctor_id} - {d.doctor_name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Type + Date */}
          <div style={ms.grid2}>
            <Field label="Type / Purpose" required>
              <select style={ms.select} name="appointment_type" value={form.appointment_type} onChange={handleChange}>
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

          {/* Status */}
          <div style={ms.grid2}>
            <Field label="Status">
              <select style={ms.select} name="status" value={form.status} onChange={handleChange}>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div style={ms.footer}>
          <button style={ms.cancelBtn} onClick={onClose}>Cancel</button>

          <button
            style={{ ...ms.saveBtn, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}