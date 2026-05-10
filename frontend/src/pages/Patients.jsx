import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarStyles, navItems } from "../components/SideBar";
import AddPatientModal from "../CRUD/CRUD_Patients/AddPatientModal";
import ReadPatientModal from "../CRUD/CRUD_Patients/readPatientModal";
import EditPatientModal from "../CRUD/CRUD_Patients/EditPatientModal";

const genderBadgeStyle = (gender) => {
  const g = gender?.toLowerCase();
  if (g === "male") return { background:"#dbeafe", color:"#1d4ed8" };
  if (g === "female") return { background:"#fce7f3", color:"#9d174d" };
  return { background:"#e0e7ff", color:"#4338ca" };
};

const TH = { padding:"10px 16px", textAlign:"left", fontSize:"11px", fontWeight:"700", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #e2e8f0", whiteSpace:"nowrap" };
const TD = { padding:"11px 16px", fontSize:"13px", color:"#334155", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" };

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [readPatient, setReadPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { fetchPatients(); }, []);

  async function fetchPatients() {
    try {
      setLoading(true);
      const res = await fetch(`${URL}/api/patients`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function deletePatient(id) {
    if (!window.confirm("Delete this patient?")) return;
    await fetch(`${URL}/api/patients/${id}`, { method:"DELETE" });
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s; });
    fetchPatients();
  }

  async function deleteSelected() {
    if (!selected.size || !window.confirm(`Delete ${selected.size} patient(s)?`)) return;
    await Promise.all([...selected].map((id) => fetch(`${URL}/api/patients/${id}`, { method:"DELETE" })));
    setSelected(new Set());
    fetchPatients();
  }

  async function deleteAll() {
    if (!patients.length || !window.confirm(`Delete ALL ${patients.length} patients? This cannot be undone.`)) return;
    await Promise.all(patients.map((p) => fetch(`${URL}/api/patients/${p.patient_id}`, { method:"DELETE" })));
    setSelected(new Set());
    fetchPatients();
  }

  function toggleRow(id) {
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  function toggleAll(e) {
    setSelected(e.target.checked ? new Set(filtered.map((p) => p.patient_id)) : new Set());
  }

  const filtered = patients.filter((p) =>
    [p.patient_name, p.phone, p.address].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display:"flex", fontFamily:"'Inter','Segoe UI',Arial,sans-serif", background:"#f8fafc", minHeight:"100vh" }}>

      <aside style={sidebarStyles.sidebar}>
        <div style={sidebarStyles.sidebarBrand}>
          <div style={sidebarStyles.brandIcon}>H+</div>
          <div><p style={sidebarStyles.brandName}>MediCare</p><p style={sidebarStyles.brandSub}>Hospital System</p></div>
        </div>
        <nav style={sidebarStyles.navSection}>
          <span style={sidebarStyles.navLabel}>Main Menu</span>
          {navItems.map((item) => (
            <button key={item.label} style={{ ...sidebarStyles.navBtn, ...(location.pathname === item.path ? sidebarStyles.navBtnActive : {}) }} onClick={() => navigate(item.path)}>
              <span style={sidebarStyles.navIcon}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={sidebarStyles.sidebarFooter}><p style={sidebarStyles.footerText}>Hospital Management<br />System v1.0</p></div>
      </aside>

      <main style={{ marginLeft:"220px", padding:"32px 28px", width:"100%", minHeight:"100vh", boxSizing:"border-box" }}>
        <div style={{ marginBottom:"24px" }}>
          <h1 style={{ margin:"0 0 4px", fontSize:"24px", fontWeight:"700", color:"#0f172a" }}>Patients</h1>
          <p style={{ margin:0, fontSize:"14px", color:"#64748b" }}>Manage and view all registered patient records</p>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px", gap:"10px", flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, maxWidth:"300px" }}>
            <span style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize:"13px" }}>🔍</span>
            <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width:"100%", padding:"8px 12px 8px 34px", border:"1px solid #e2e8f0", borderRadius:"8px", fontSize:"13px", color:"#0f172a", background:"#fff", outline:"none", fontFamily:"inherit" }} />
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            <button onClick={deleteAll} disabled={!patients.length}
              style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:patients.length?"pointer":"not-allowed", fontFamily:"inherit", background:"#fff", color:"#ef4444", border:"1px solid #fee2e2", opacity:patients.length?1:0.4 }}>
              🗑 Delete All
            </button>
            <button onClick={() => setShowAdd(true)}
              style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#1a56db", color:"#fff", border:"none", padding:"8px 14px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit" }}>
              ＋ Add Patient
            </button>
          </div>
        </div>

        <div style={{ background:"#fff", borderRadius:"12px", border:"1px solid #e2e8f0", overflow:"hidden" }}>
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:"15px", fontWeight:"600", color:"#0f172a" }}>All Patients</span>
            <span style={{ fontSize:"12px", color:"#64748b", background:"#f1f5f9", borderRadius:"20px", padding:"2px 10px" }}>
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {selected.size > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 20px", background:"#eff6ff", borderBottom:"1px solid #bfdbfe", fontSize:"13px", color:"#1e40af" }}>
              <span>{selected.size} patient{selected.size !== 1 ? "s" : ""} selected</span>
              <button onClick={deleteSelected}
                style={{ padding:"4px 12px", borderRadius:"6px", border:"1px solid #fee2e2", background:"#fff", color:"#ef4444", fontSize:"12px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit" }}>
                🗑 Delete selected
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ padding:"48px 20px", textAlign:"center", color:"#94a3b8", fontSize:"14px" }}>Loading...</div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
                <colgroup>
                  <col style={{ width:"40px" }} /><col style={{ width:"68px" }} /><col style={{ width:"20%" }} />
                  <col style={{ width:"15%" }} /><col style={{ width:"96px" }} /><col /><col style={{ width:"198px" }} />
                </colgroup>
                <thead>
                  <tr style={{ background:"#f8fafc" }}>
                    <th style={{ ...TH, textAlign:"center" }}>
                      <input type="checkbox" onChange={toggleAll} checked={filtered.length > 0 && filtered.every((p) => selected.has(p.patient_id))} style={{ cursor:"pointer", accentColor:"#1a56db" }} />
                    </th>
                    {["ID","Name","Phone","Gender","Address","Actions"].map((h) => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding:"48px 20px", textAlign:"center", color:"#94a3b8", fontSize:"14px" }}>No patients found.</td></tr>
                  ) : filtered.map((p) => (
                    <tr key={p.patient_id} style={{ borderBottom:"1px solid #f1f5f9", background:selected.has(p.patient_id)?"#f0f9ff":"transparent" }}>
                      <td style={{ ...TD, textAlign:"center" }}>
                        <input type="checkbox" checked={selected.has(p.patient_id)} onChange={() => toggleRow(p.patient_id)} style={{ cursor:"pointer", accentColor:"#1a56db" }} />
                      </td>
                      <td style={{ ...TD, fontSize:"11px", color:"#94a3b8", fontWeight:"600" }}>{p.patient_id}</td>
                      <td style={{ ...TD, fontWeight:"700", color:"#0f172a" }}>{p.patient_name}</td>
                      <td style={TD}>{p.phone}</td>
                      <td style={TD}>
                        <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 9px", borderRadius:"20px", fontSize:"11px", fontWeight:"600", ...genderBadgeStyle(p.gender) }}>
                          {p.gender}
                        </span>
                      </td>
                      <td style={TD} title={p.address}>{p.address}</td>
                      <td style={TD}>
                        <div style={{ display:"flex", gap:"5px" }}>
                          <button onClick={() => setReadPatient(p)}
                            style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"4px 10px", borderRadius:"6px", border:"1px solid #e2e8f0", background:"#fff", color:"#475569", fontSize:"12px", fontWeight:"500", cursor:"pointer", fontFamily:"inherit" }}>
                            👁 View
                          </button>
                          <button onClick={() => setEditPatient(p)}
                            style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"4px 10px", borderRadius:"6px", border:"1px solid #bfdbfe", background:"#fff", color:"#1a56db", fontSize:"12px", fontWeight:"500", cursor:"pointer", fontFamily:"inherit" }}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => deletePatient(p.patient_id)}
                            style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"4px 10px", borderRadius:"6px", border:"1px solid #fee2e2", background:"#fff", color:"#ef4444", fontSize:"12px", fontWeight:"500", cursor:"pointer", fontFamily:"inherit" }}>
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); fetchPatients(); }} />}
      {readPatient && <ReadPatientModal patient={readPatient} onClose={() => setReadPatient(null)} onEdit={() => { setEditPatient(readPatient); setReadPatient(null); }} />}
      {editPatient && <EditPatientModal patient={editPatient} onClose={() => setEditPatient(null)} onSaved={() => { setEditPatient(null); fetchPatients(); }} />}
    </div>
  );
}

export default Patients;