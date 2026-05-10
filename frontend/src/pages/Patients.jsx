import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarStyles, navItems } from "../components/sideBar";
import AddPatientModal from "../CRUD/CRUD_Patients/AddPatientModal";
import ReadPatientModal from "../CRUD/CRUD_Patients/ReadPatientModal";
import EditPatientModal from "../CRUD/CRUD_Patients/EditPatientModal";

const genderBadge = (gender) => {
  const g = gender?.toLowerCase();
  if (g === "male") return { background: "#dbeafe", color: "#1d4ed8" };
  if (g === "female") return { background: "#fce7f3", color: "#9d174d" };
  return { background: "#e0e7ff", color: "#4338ca" };
};

const TH = {
  padding: "14px 18px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "600",
  color: "#64748b",
  borderBottom: "1px solid #e2e8f0",
  background: "#f8fafc",
  whiteSpace: "nowrap",
};

const TD = {
  padding: "14px 18px",
  fontSize: "13px",
  color: "#334155",
  borderBottom: "1px solid #e2e8f0",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());

  const [showAdd, setShowAdd] = useState(false);
  const [readPat, setReadPat] = useState(null);
  const [editPat, setEditPat] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      setLoading(true);
      const res = await fetch(`${URL}/api/patients`);
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  async function deletePatient(id) {
    if (!window.confirm("Delete this patient?")) return;
    await fetch(`${URL}/api/patients/${id}`, { method: "DELETE" });
    fetchPatients();
  }

  function toggleRow(id) {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  const filtered = patients.filter((p) =>
    [p.patient_name, p.phone, p.address, p.gender, p.condition, p.blood_type]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* SIDEBAR */}
      <aside style={sidebarStyles.sidebar}>
        <div style={sidebarStyles.sidebarBrand}>
          <div style={sidebarStyles.brandIcon}>H+</div>
          <div>
            <p style={sidebarStyles.brandName}>MediCare</p>
            <p style={sidebarStyles.brandSub}>Hospital System</p>
          </div>
        </div>

        <nav style={sidebarStyles.navSection}>
          <span style={sidebarStyles.navLabel}>Main Menu</span>

          {navItems.map((item) => (
            <button
              key={item.label}
              style={{
                ...sidebarStyles.navBtn,
                ...(location.pathname === item.path
                  ? sidebarStyles.navBtnActive
                  : {}),
              }}
              onClick={() => navigate(item.path)}
            >
              <span style={sidebarStyles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main
        style={{ marginLeft: "220px", padding: "32px 28px", width: "100%" }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
          Patients
        </h1>

        <p style={{ fontSize: "14px", color: "#64748b" }}>
          Manage patient records
        </p>

        {/* TABLE CARD */}
        <div
          style={{
            marginTop: "16px",
            background: "#fff",
            borderRadius: "12px",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: "600" }}>All Patients</span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {filtered.length} records
            </span>
          </div>

          {loading ? (
            <p style={{ padding: "20px" }}>Loading...</p>
          ) : (
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ ...TH, width: "50px", textAlign: "center" }}>
                      #
                    </th>
                    <th style={TH}>ID</th>
                    <th style={TH}>Name</th>
                    <th style={TH}>Phone</th>
                    <th style={TH}>Gender</th>
                    <th style={TH}>Blood Type</th>
                    <th style={TH}>Condition</th>
                    <th style={TH}>Address</th>
                    <th style={{ ...TH, width: "13%" }}>Actions</th>{" "}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.patient_id}>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selected.has(p.patient_id)}
                          onChange={() => toggleRow(p.patient_id)}
                        />
                      </td>

                      <td style={TD}>{p.patient_id}</td>

                      <td style={{ ...TD, fontWeight: "600" }}>
                        {p.patient_name}
                      </td>

                      <td style={TD}>{p.phone}</td>

                      <td style={TD}>
                        <span style={genderBadge(p.gender)}>{p.gender}</span>
                      </td>

                      <td style={TD}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "999px",
                            background: "#e0e7ff",
                            color: "#3730a3",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          {p.blood_type || "N/A"}
                        </span>
                      </td>

                      <td style={TD}>{p.condition || "N/A"}</td>

                      <td style={TD}>{p.address}</td>

                      {/* ✅ MATCHED DOCTORS ACTION STYLE */}
                      <td style={TD}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <button
                            onClick={() => setReadPat(p)}
                            style={{
                              padding: "7px 14px",
                              borderRadius: "7px",
                              border: "1px solid #dbe2ea",
                              background: "#fff",
                              color: "#334155",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>

                          <button
                            onClick={() => setEditPat(p)}
                            style={{
                              padding: "7px 14px",
                              borderRadius: "7px",
                              border: "1px solid #bfdbfe",
                              background: "#eff6ff",
                              color: "#2563eb",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deletePatient(p.patient_id)}
                            style={{
                              padding: "7px 14px",
                              borderRadius: "7px",
                              border: "1px solid #fecaca",
                              background: "#fef2f2",
                              color: "#ef4444",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Delete
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

      {/* MODALS */}
      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} />}
      {readPat && (
        <ReadPatientModal patient={readPat} onClose={() => setReadPat(null)} />
      )}
      {editPat && (
        <EditPatientModal patient={editPat} onClose={() => setEditPat(null)} />
      )}
    </div>
  );
}
