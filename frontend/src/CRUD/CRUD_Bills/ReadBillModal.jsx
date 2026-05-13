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
    paid: { background: "#d1fae5", color: "#065f46" },
    unpaid: { background: "#fee2e2", color: "#b91c1c" },
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

export default function ReadBillModal({ bill: b, onClose, onEdit }) {
  const ss = statusStyle(b.status);

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return isNaN(date) ? d : date.toLocaleDateString("en-PH", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const formatAmount = (a) =>
    a != null
      ? `₱ ${Number(a).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "—";

  return (
    <div
      style={ms.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={ms.modal}>
        {/* Header */}
        <div style={ms.header}>
          <span style={ms.title}>Bill Details</span>
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
              {b.status || "—"}
            </span>
            <button style={ms.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={ms.body}>
          {/* Patient row */}
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
              {initials(b.patient_name)}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                {b.patient_name || "—"}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                Patient · ID {b.patient_id}
              </div>
            </div>
          </div>

          {/* Bill info */}
          <div style={ms.sectionLabel}>Bill Information</div>
          <div style={{ ...ms.readGrid, marginBottom: "18px" }}>
            <Row label="Bill ID" value={`#${b.bill_id}`} />
            <Row label="Bill Date" value={formatDate(b.bill_date)} />
            <Row label="Amount" value={formatAmount(b.amount)} />
            <Row label="Status" value={b.status} />
          </div>

          {/* Treatment */}
          {(b.treatment_name || b.treatment_id) && (
            <>
              <hr style={ms.divider} />
              <div style={ms.sectionLabel}>Treatment</div>
              <div style={{ ...ms.avatarRow, marginBottom: "0" }}>
                <div
                  style={{
                    width: "46px",
                    height: "46px",
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
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                    {b.treatment_name || `Treatment #${b.treatment_id}`}
                  </div>
                  {b.treatment_cost != null && (
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                      Cost: {formatAmount(b.treatment_cost)}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
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