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

const statusStyle = (s) => {
  const map = {
    scheduled: { background: "#dbeafe", color: "#1d4ed8" },
    completed: { background: "#d1fae5", color: "#065f46" },
    cancelled: { background: "#fee2e2", color: "#b91c1c" },
    pending: { background: "#fef3c7", color: "#92400e" },
  };
  return map[s?.toLowerCase()] || { background: "#f1f5f9", color: "#475569" };
};

function Row({ label, value, full }) {
  return (
    <div style={full ? { gridColumn: "1/-1" } : {}}>
      <div style={ms.detailLabel}>{label}</div>
      <div style={ms.detailValue}>{value || "—"}</div>
    </div>
  );
}

export default function ReadAppointmentModal({
  appointment: a,
  onClose,
  onEdit,
}) {
  const ss = statusStyle(a.status);
  return (
    <div
      style={ms.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={ms.modal}>
        <div style={ms.header}>
          <span style={ms.title}>Appointment Details</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 11px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "700",
                ...ss,
              }}
            >
              {a.status || "—"}
            </span>
            <button style={ms.closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <div style={ms.body}>
          {/* Patient */}
          <div style={ms.sectionLabel}>Patient</div>
          <div style={{ ...ms.avatarRow, marginBottom: "18px" }}>
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
              {initials(a.patient_name)}
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                {a.patient_name || "—"}
              </div>
              <div
                style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}
              >
                Patient · {a.patient_id}
              </div>
            </div>
          </div>

          {/* Appointment info */}
          <div style={ms.sectionLabel}>Appointment Info</div>
          <div style={{ ...ms.readGrid, marginBottom: "18px" }}>
            <Row label="Appointment ID" value={a.appointment_id} />
            <Row label="Type / Purpose" value={a.type} />
            <Row label="Date" value={a.appointment_date} />
            <Row label="Time" value={a.appointment_time} />
          </div>

          <hr style={ms.divider} />

          {/* Doctor */}
          <div style={ms.sectionLabel}>Assigned Doctor</div>
          <div style={{ ...ms.avatarRow, marginBottom: "18px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "#d1fae5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: "700",
                color: "#065f46",
                flexShrink: 0,
              }}
            >
              {initials((a.doctor_name || "").replace("Dr. ", ""))}
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                {a.doctor_name || "—"}
              </div>
              <div
                style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}
              >
                {a.doctor_specialty || "Doctor"} · {a.doctor_id}
              </div>
            </div>
          </div>

          {/* Notes */}
          {a.notes && (
            <>
              <hr style={ms.divider} />
              <div style={ms.sectionLabel}>Notes</div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {a.notes}
              </p>
            </>
          )}
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
