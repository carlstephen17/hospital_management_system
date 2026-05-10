import React from "react";
import { modalStyles as ms } from "../../components/SideBar";

function initials(name) { return (name || "").replace("Dr. ","").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(); }

function Row({ label, value, full }) {
  return (
    <div style={full ? { gridColumn:"1/-1" } : {}}>
      <div style={ms.detailLabel}>{label}</div>
      <div style={ms.detailValue}>{value || "—"}</div>
    </div>
  );
}

export default function ReadDoctorModal({ doctor: d, onClose, onEdit }) {
  return (
    <div style={ms.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        <div style={ms.header}>
          <span style={ms.title}>Doctor Details</span>
          <button style={ms.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={ms.body}>
          <div style={ms.avatarRow}>
            <div style={{ width:"46px", height:"46px", borderRadius:"50%", background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", fontWeight:"700", color:"#065f46", flexShrink:0 }}>
              {initials(d.doctor_name)}
            </div>
            <div>
              <div style={{ fontSize:"15px", fontWeight:"700", color:"#0f172a" }}>{d.doctor_name}</div>
              <div style={{ fontSize:"12px", color:"#64748b", marginTop:"2px" }}>{d.doctor_specialty}{d.department_id ? ` · ${d.department_id}` : ""}</div>
            </div>
          </div>

          <div style={ms.sectionLabel}>Personal Information</div>
          <div style={{ ...ms.readGrid, marginBottom:"18px" }}>
            <Row label="Doctor ID"  value={d.doctor_id} />
            <Row label="Phone"      value={d.phone} />
            <Row label="Email"      value={d.email} />
            <Row label="License No." value={d.license_no} />
          </div>

          <hr style={ms.divider} />

          <div style={ms.sectionLabel}>Professional Details</div>
          <div style={ms.readGrid}>
            <Row label="Specialization" value={d.doctor_specialty} />
            <Row label="Department ID"  value={d.department_id} />
            <Row label="Schedule"       value={d.schedule} full />
          </div>
        </div>
        <div style={ms.footer}>
          <button style={ms.cancelBtn} onClick={onClose}>Close</button>
          <button style={ms.editActionBtn} onClick={onEdit}>✏️ Edit</button>
        </div>
      </div>
    </div>
  );
}