import React, { useState, useEffect } from "react";
import { URL } from "../../API";
import { modalStyles as MS } from "../../components/SideBar";

function CreateTreatmentModal({ onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    treatment_name: "",
    cost: "",
    department_id: "",
  });

  const treatmentOptions = [
    { name: "Consultation", cost: 500 },
    { name: "Blood Test", cost: 200 },
    { name: "X-Ray", cost: 800 },
    { name: "Surgery", cost: 5000 },
    { name: "Therapy", cost: 300 },
    { name: "Vaccination", cost: 150 },
    { name: "Check-up", cost: 250 },
  ];

  useEffect(() => {
    fetch(`${URL}/api/departments`)
      .then((r) => r.json())
      .then((d) => setDepartments(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    const selected = treatmentOptions.find(t => t.name === form.treatment_name);
    if (selected) {
      setForm(prev => ({ ...prev, cost: selected.cost.toString() }));
    }
  }, [form.treatment_name]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.treatment_name.trim()) {
      setError("Treatment name is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatment_name: form.treatment_name,
          cost: form.cost ? parseFloat(form.cost) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create treatment.");
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div style={MS.overlay} onClick={onClose}>
      <div style={MS.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={MS.header}>
          <span style={MS.title}>Add Treatment</span>
          <button style={MS.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={MS.body}>
          {error && <div style={MS.errBox}>{error}</div>}

          <p style={MS.sectionLabel}>Treatment Information</p>

          <div style={MS.grid2}>
            <div style={MS.formGroup}>
              <label style={MS.label}>Treatment Name *</label>
              <select
                style={MS.input}
                name="treatment_name"
                value={form.treatment_name}
                onChange={handleChange}
              >
                <option value="">Select treatment</option>
                {treatmentOptions.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
            <div style={MS.formGroup}>
              <label style={MS.label}>Cost (₱)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                style={MS.input}
                name="cost"
                value={form.cost}
                readOnly
              />
            </div>
          </div>

          <div style={MS.formGroup}>
            <label style={MS.label}>Department</label>
            <select
              style={MS.select}
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>
          </div>

          <div style={MS.formGroup}>
            <label style={MS.label}>Description</label>
            <textarea
              style={{
                ...MS.input,
                resize: "vertical",
                minHeight: "80px",
                fontFamily: "inherit",
              }}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the treatment..."
            />
          </div>
        </div>

        {/* Footer */}
        <div style={MS.footer}>
          <button style={MS.cancelBtn} onClick={onClose} type="button">
            Cancel
          </button>
          <button
            style={{ ...MS.saveBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
            type="button"
          >
            {loading ? "Creating..." : "Create Treatment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTreatmentModal;