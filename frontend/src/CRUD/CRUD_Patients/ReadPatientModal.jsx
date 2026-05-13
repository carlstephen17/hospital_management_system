import React from "react";
import { modalStyles as ms, MODAL_CSS } from "../../components/SideBar";

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Avatar accent — cycles through 4 color pairs based on first char
const AVATAR_COLORS = [
  ["rgba(59,130,246,0.18)", "#60a5fa"],
  ["rgba(52,211,153,0.15)", "#34d399"],
  ["rgba(251,191,36,0.15)", "#fbbf24"],
  ["rgba(236,72,153,0.15)", "#f472b6"],
];

function avatarColor(name) {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// Gender badge
function GenderBadge({ gender }) {
  const styles = {
    Male: {
      bg: "rgba(59,130,246,0.15)",
      color: "#60a5fa",
      border: "rgba(59,130,246,0.3)",
    },
    Female: {
      bg: "rgba(236,72,153,0.13)",
      color: "#f472b6",
      border: "rgba(236,72,153,0.3)",
    },
  };

  const s = styles[gender] || {
    bg: "rgba(99,102,241,0.13)",
    color: "#a5b4fc",
    border: "rgba(99,102,241,0.3)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {gender}
    </span>
  );
}

// Status badge
const STATUS = {
  Admitted: {
    bg: "rgba(59,130,246,0.13)",
    color: "#60a5fa",
    border: "rgba(59,130,246,0.3)",
  },
  Discharged: {
    bg: "rgba(52,211,153,0.12)",
    color: "#34d399",
    border: "rgba(52,211,153,0.3)",
  },
  Recovered: {
    bg: "rgba(52,211,153,0.12)",
    color: "#34d399",
    border: "rgba(52,211,153,0.3)",
  },
  Critical: {
    bg: "rgba(251,191,36,0.12)",
    color: "#fbbf24",
    border: "rgba(251,191,36,0.3)",
  },
  Deceased: {
    bg: "rgba(248,113,113,0.12)",
    color: "#f87171",
    border: "rgba(248,113,113,0.3)",
  },
  Inactive: {
    bg: "rgba(100,116,139,0.15)",
    color: "#94a3b8",
    border: "rgba(100,116,139,0.3)",
  },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.Inactive;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {status || "—"}
    </span>
  );
}

// Detail row
function Row({ label, value, full, children }) {
  return (
    <div style={full ? { gridColumn: "1/-1" } : {}}>
      <div style={ms.detailLabel}>{label}</div>
      <div style={ms.detailValue}>{children ?? value ?? "—"}</div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReadPatientModal({ patient: p, onClose, onEdit }) {
  if (!p) return null;

  const [avatarBg, avatarFg] = avatarColor(p.patient_name);

  return (
    <>
      <style>{MODAL_CSS}</style>

      <div
        style={ms.overlay}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="pm-modal" style={ms.modal}>

          {/* HEADER */}
          <div style={ms.header}>
            <div style={ms.titleRow}>
              <div style={ms.titleIcon}>👤</div>
              <h2 style={ms.title}>Patient Details</h2>
            </div>

            <button
              className="pm-close"
              style={ms.closeBtn}
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div style={ms.body}>

            {/* Avatar Card */}
            <div style={ms.avatarRow}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: avatarBg,
                  border: `1.5px solid ${avatarFg}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: avatarFg,
                  flexShrink: 0,
                  letterSpacing: "-0.03em",
                }}
              >
                {initials(p.patient_name)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#e8eeff",
                    lineHeight: 1.3,
                  }}
                >
                  {p.patient_name || "—"}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#3d4f6e",
                    marginTop: 3,
                  }}
                >
                  Patient ·{" "}
                  <span style={{ color: "#7a8fad" }}>
                    {p.patient_id}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                {p.gender && <GenderBadge gender={p.gender} />}
                {p.status && <StatusBadge status={p.status} />}
              </div>
            </div>

            {/* Personal Information */}
            <div style={ms.sectionLabel}>
              Personal Information
            </div>

            <div style={{ ...ms.readGrid, marginBottom: 18 }}>
              <Row label="Patient ID" value={p.patient_id} />
              <Row label="Phone" value={p.phone} />
              <Row label="Gender">
                {p.gender ? (
                  <GenderBadge gender={p.gender} />
                ) : (
                  "—"
                )}
              </Row>
              <Row label="Blood Type" value={p.blood_type} />
              <Row label="Address" value={p.address} full />
            </div>

            <hr style={ms.divider} />

            {/* Medical Information */}
            <div style={ms.sectionLabel}>
              Medical Information
            </div>

            <div style={{ ...ms.readGrid, marginBottom: 18 }}>
              <Row
                label="Medical Condition"
                value={p.medical_condition}
              />

              <Row label="Status">
                {p.status ? (
                  <StatusBadge status={p.status} />
                ) : (
                  "—"
                )}
              </Row>
            </div>

          </div>

          {/* FOOTER */}
          <div style={ms.footer}>
            <button
              className="pm-cancel"
              style={ms.cancelBtn}
              onClick={onClose}
            >
              Close
            </button>

            {onEdit && (
              <button
                className="pm-edit-btn"
                style={ms.editActionBtn}
                onClick={onEdit}
              >
                ✏️ Edit Patient
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}