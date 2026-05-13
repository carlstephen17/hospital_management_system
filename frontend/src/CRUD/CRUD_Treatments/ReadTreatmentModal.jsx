import React from "react";
import { modalStyles as MS } from "../../components/SideBar";

function ReadTreatmentModal({ treatment, departments, onClose, onEdit }) {
  const dept = departments.find(
    (d) => String(d.department_id) === String(treatment.department_id)
  );

  const Detail = ({ label, value, full = false }) => (
    <div style={full ? { marginBottom: "14px" } : {}}>
      <p style={MS.detailLabel}>{label}</p>
      <p style={MS.detailValue}>{value || "—"}</p>
    </div>
  );

  return (
    <div style={MS.overlay} onClick={onClose}>
      <div style={MS.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={MS.header}>
          <span style={MS.title}>Treatment Details</span>
          <button style={MS.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={MS.body}>
          {/* Avatar-style name row */}
          <div style={MS.avatarRow}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0,
              }}
            >
              💊
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>
                {treatment.treatment_name}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                {dept?.department_name || "No department assigned"}
              </p>
            </div>
          </div>

          <p style={MS.sectionLabel}>Treatment Information</p>
          <div style={MS.readGrid}>
            <Detail label="Treatment ID" value={`#${treatment.treatment_id}`} />
            <Detail
              label="Cost"
              value={
                treatment.cost
                  ? `₱ ${Number(treatment.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  : null
              }
            />
            <Detail label="Department" value={dept?.department_name} />
          </div>

          <hr style={MS.divider} />

          <p style={MS.sectionLabel}>Description</p>
          <p style={{ ...MS.detailValue, lineHeight: 1.6, color: "#475569" }}>
            {treatment.description || "No description provided."}
          </p>
        </div>

        {/* Footer */}
        <div style={MS.footer}>
          <button style={MS.cancelBtn} onClick={onClose} type="button">
            Close
          </button>
          <button style={MS.editActionBtn} onClick={onEdit} type="button">
            Edit Treatment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReadTreatmentModal;