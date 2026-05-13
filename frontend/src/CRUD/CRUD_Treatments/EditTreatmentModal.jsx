import React, { useState, useEffect } from "react";
import { URL } from "../../API";
import { modalStyles as MS } from "../../components/SideBar";

function EditTreatmentModal({ treatment, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [form, setForm] = useState({
    treatment_name: treatment?.treatment_name || "",
    description: treatment?.description || "",
    cost: treatment?.cost || "",
    department_id: treatment?.department_id || "",
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [tRes, dRes] = await Promise.all([
          fetch(`${URL}/api/treatments`),
          fetch(`${URL}/api/departments`)
        ]);
        const [tData, dData] = await Promise.all([tRes.json(), dRes.json()]);
        setTreatmentOptions(Array.isArray(tData) ? tData : []);
        setDepartmentOptions(Array.isArray(dData) ? dData : []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOptions();
  }, []);

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
      const res = await fetch(`${URL}/api/treatments/${treatment.treatment_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatment_name: form.treatment_name,
          description: form.description || null,
          cost: form.cost ? parseFloat(form.cost) : null,
          department_id: form.department_id || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update treatment.");
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
          <span style={MS.title}>Edit Treatment</span>
          <button style={MS.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={MS.body}>
          {error && <div style={MS.errBox}>{error}</div>}

          <p style={MS.sectionLabel}>Treatment Information</p>

          {/* Treatment Name */}
          <div style={MS.formGroup}>
            <label style={MS.label}>Treatment Name *</label>
            <select
              style={MS.select}
              name="treatment_name"
              value={form.treatment_name}
              onChange={handleChange}
            >
              <option value="">Select Treatment</option>
              {treatmentOptions.map((t) => (
                <option key={t.treatment_id} value={t.treatment_name}>
                  {t.treatment_name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={MS.formGroup}>
            <label style={MS.label}>Description</label>
            <select
              style={MS.select}
              name="description"
              value={form.description}
              onChange={handleChange}
            >
              <option value="">Select Description</option>
              {treatmentOptions.map((t) => (
                <option key={t.treatment_id} value={t.description || ""}>
                  {t.description || "—"}
                </option>
              ))}
            </select>
          </div>

          {/* Cost */}
          <div style={MS.formGroup}>
            <label style={MS.label}>Cost (₱)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              style={MS.input}
              name="cost"
              value={form.cost}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {/* Department */}
          <div style={MS.formGroup}>
            <label style={MS.label}>Department</label>
            <select
              style={MS.select}
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departmentOptions.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTreatmentModal;