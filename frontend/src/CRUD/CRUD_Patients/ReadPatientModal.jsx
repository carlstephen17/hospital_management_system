import React from "react";
import { modalStyles as ms } from "../../components/SideBar";

function initials(name) {
  return (name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Row({ label, value, full }) {
  return (
    <div style={full ? { gridColumn: "1/-1" } : {}}>
      <div style={ms.detailLabel}>{label}</div>
      <div style={ms.detailValue}>{value || "—"}</div>
    </div>
  );
}

const genderBadge = (g) => {
  if (g?.toLowerCase() === "male")
    return { background: "#dbeafe", color: "#1d4ed8" };
  if (g?.toLowerCase() === "female")
    return { background: "#fce7f3", color: "#9d174d" };
  return { background: "#e0e7ff", color: "#4338ca" };
};

export default function ReadPatientModal({ patient: p, onClose, onEdit }) {
  return (
    <div
      style={ms.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={ms.modal}>
        <div style={ms.header}>
          <span style={ms.title}>Patient Details</span>
          <button style={ms.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={ms.body}>
          {/* Avatar row */}
          <div style={ms.avatarRow}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: "700",
                color: "#1d4ed8",
                flexShrink: 0,
              }}
            >
              {initials(p.patient_name)}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                {p.patient_name}
              </div>
              <div
                style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}
              >
                Patient · {p.patient_id}
              </div>
            </div>
            {p.gender && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 11px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                  ...genderBadge(p.gender),
                }}
              >
                {p.gender}
              </span>
            )}
          </div>

          {/* Personal info */}
          <div style={ms.sectionLabel}>Personal Information</div>
          <div style={{ ...ms.readGrid, marginBottom: "18px" }}>
            <Row label="Patient ID" value={p.patient_id} />
            <Row label="Phone" value={p.phone} />
            <Row label="Date of Birth" value={p.dob} />
            <Row label="Blood Type" value={p.blood_type} />
            <Row label="Address" value={p.address} full />
          </div>

          <hr style={ms.divider} />

          {/* Notes */}
          <div style={ms.sectionLabel}>Medical Notes</div>
          <div
            style={{
              ...ms.detailValue,
              color: "#64748b",
              fontWeight: "400",
              lineHeight: 1.6,
            }}
          >
            {p.notes || "None"}
          </div>
        </div>
        <div style={ms.footer}>
          <button style={ms.cancelBtn} onClick={onClose}>
            Close
          </button>
          <button style={ms.editActionBtn} onClick={onEdit}>
            ✏️ Edit
          </button>
        </div>
      </div>
    </div>
  );
}
