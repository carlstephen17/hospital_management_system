import React, { useEffect, useState } from "react";
import { URL } from "../../API";
import { modalStyles as ms } from "../../components/SideBar";

function Field({ label, required, children }) {
  return (
    <div style={ms.formGroup}>
      <label style={ms.label}>
        {label}

        {required && (
          <span
            style={{
              color: "#ef4444",
              marginLeft: "2px",
            }}
          >
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

export default function EditDoctorModal({
  doctor,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    doctor_name: doctor?.doctor_name || "",
    phone: doctor?.phone || "",
    doctor_specialty:
      doctor?.doctor_specialty || "",
    department_id:
      doctor?.department_id || "",
    email: doctor?.email || "",
  });

  const [departments, setDepartments] =
    useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        const res = await fetch(
          `${URL}/api/departments`
        );

        if (!res.ok) {
          throw new Error(
            "Failed to fetch departments"
          );
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
        "Doctor Name, Phone, Specialization, Department, and Email are required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${URL}/api/doctors/${doctor.doctor_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update doctor"
        );
      }

      if (onSaved) {
        onSaved(data);
      }

      onClose();
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={ms.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={ms.modal}>
        {/* Header */}
        <div style={ms.header}>
          <span style={ms.title}>
            Edit Doctor
          </span>

          <button
            type="button"
            style={ms.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={ms.body}>
          {error && (
            <div style={ms.errBox}>
              ⚠ {error}
            </div>
          )}

          {/* Row 1 */}
          <div style={ms.grid2}>
            <Field label="Full Name" required>
              <input
                type="text"
                name="doctor_name"
                style={ms.input}
                value={form.doctor_name}
                onChange={handleChange}
                placeholder="Dr. Juan Santos"
              />
            </Field>

            <Field label="Phone" required>
              <input
                type="text"
                name="phone"
                style={ms.input}
                value={form.phone}
                onChange={handleChange}
                placeholder="+63 9XX XXX XXXX"
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div style={ms.grid2}>
            <Field label="Department" required>
              <select
                style={ms.select}
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Department
                </option>

                {departments.map((d) => (
                  <option
                    key={d.department_id}
                    value={d.department_id}
                  >
                    {d.department_id} -{" "}
                    {d.department_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Specialization"
              required
            >
              <select
                style={ms.select}
                name="doctor_specialty"
                value={
                  form.doctor_specialty
                }
                onChange={handleChange}
              >
                <option value="">
                  Select Specialization
                </option>

                {doctorSpecializations.map(
                  (specialty) => (
                    <option
                      key={specialty}
                      value={specialty}
                    >
                      {specialty}
                    </option>
                  )
                )}
              </select>
            </Field>
          </div>

          {/* Row 3 */}
          <div style={ms.grid2}>
            <Field label="Email" required>
              <input
                type="email"
                name="email"
                style={ms.input}
                value={form.email}
                onChange={handleChange}
                placeholder="dr@hospital.com"
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div style={ms.footer}>
          <button
            type="button"
            style={ms.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            style={{
              ...ms.saveBtn,
              opacity: saving ? 0.7 : 1,
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}