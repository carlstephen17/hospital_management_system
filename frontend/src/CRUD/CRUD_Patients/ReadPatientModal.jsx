import React from "react";
import { modalStyles as ms } from "../../components/SideBar";

function initials(name) {
  return name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}

function Row({ label, value }) {
  return (
    <div>
      <div style={ms.detailLabel}>{label}</div>
      <div style={ms.detailValue}>{value || "—"}</div>
    </div>
  );
}

function ReadPatientModal({ patient: p, onClose, onEdit }) {
  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        <div style={ms.header}>
          <span style={ms.title}>Patient Details</span>
          <button style={ms.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={ms.body}>
          {/* Avatar + name */}
          <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"18px", paddingBottom:"16px", borderBottom:"1px solid #f1f5f9" }}>
            <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", fontWeight:"700", color:"#1d4ed8", flexShrink:0 }}>
              {initials(p.patient_name)}
            </div>
            <div>
              <div style={{ fontSize:"16px", fontWeight:"700", color:"#0f172a" }}>{p.patient_name}</div>
              <div style={{ fontSize:"12px", color:"#64748b", marginTop:"2px" }}>{p.patient_id}</div>
            </div>
          </div>
          {/* Details grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            <Row label="Phone" value={p.phone} />
            <Row label="Gender" value={p.gender} />
            <Row label="Date of Birth" value={p.dob} />
            <Row label="Blood Type" value={p.blood_type} />
            <div style={{ gridColumn:"1/-1" }}><Row label="Address" value={p.address} /></div>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={ms.detailLabel}>Medical Notes</div>
              <div style={{ ...ms.detailValue, color:"#64748b", fontSize:"12px" }}>{p.notes || "None"}</div>
            </div>
          </div>
        </div>
        <div style={ms.footer}>
          <button style={ms.cancelBtn} onClick={onClose}>Close</button>
          <button style={ms.saveBtn} onClick={onEdit}>✏️ Edit</button>
        </div>
      </div>
    </div>
  );
}

export default ReadPatientModal;