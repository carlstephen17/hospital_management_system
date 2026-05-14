import React, { useEffect, useState } from "react";
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

export default function CreateDoctorModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    doctor_name: "",
    phone: "",
    doctor_specialty: "",
    department_id: "",
    email: "",
  });

  const [departments, setDepartments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const doctorSpecializations = [
    "Allergy and Immunology",
    "Anesthesiology",
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "General Surgery",
    "Geriatrics",
    "Hematology",
    "Infectious Disease",
    "Internal Medicine",
    "Nephrology",
    "Neurology",
    "Neurosurgery",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Otolaryngology",
    "Pathology",
    "Pediatrics",
    "Physical Medicine and Rehabilitation",
    "Plastic Surgery",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Urology",
  ];

  // Fetch departments
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch(`${URL}/api/departments`);

        if (!res.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDepartments();
  }, []);

  async function handleSave() {
    const {
      doctor_name,
      phone,
      doctor_specialty,
      email,
      department_id,
    } = form;

    if (
      !doctor_name ||
      !phone ||
      !doctor_specialty ||
      !email ||
      !department_id
    ) {
      setError(
        "Name, Phone, Specialization, Department, and Email are required."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must start with '09' and be exactly 11 digits.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${URL}/api/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to create doctor");
      }

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
          <span style={ms.title}>Add New Doctor</span>

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
                type="text"
                name="doctor_name"
                placeholder="Dr. Juan Santos"
                value={form.doctor_name}
                onChange={handleChange}
              />
            </Field>

            <Field label="Phone" required>
              <input
                style={ms.input}
                type="text"
                name="phone"
                placeholder="+63 9XX XXX XXXX"
                value={form.phone}
                onChange={handleChange}
              />
            </Field>
          </div>

          <div style={ms.grid2}>
            <Field label="Department" required>
              <select
                style={ms.select}
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
              >
                <option value="">Select Department</option>

                {departments.map((d) => (
                  <option
                    key={d.department_id}
                    value={d.department_id}
                  >
                    {d.department_id} - {d.department_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Specialization" required>
              <select
                style={ms.select}
                name="doctor_specialty"
                value={form.doctor_specialty}
                onChange={handleChange}
              >
                <option value="">Select Specialization</option>

                {doctorSpecializations.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div style={ms.grid2}>
            <Field label="Email" required>
              <input
                style={ms.input}
                type="email"
                name="email"
                placeholder="dr@hospital.com"
                value={form.email}
                onChange={handleChange}
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
            {saving ? "Saving…" : "Save Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
}