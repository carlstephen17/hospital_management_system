import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarStyles, navItems } from "../components/sideBar";
import CreatePatientModal from "../CRUD/CRUD_Patients/CreatePatientModal";
import ReadPatientModal from "../CRUD/CRUD_Patients/ReadPatientModal";
import EditPatientModal from "../CRUD/CRUD_Patients/EditPatientModal";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";

const genderBadge = (gender) => {
  const g = gender?.toLowerCase();

  if (g === "male") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
    };
  }

  if (g === "female") {
    return {
      background: "#fce7f3",
      color: "#9d174d",
    };
  }

  return {
    background: "#e0e7ff",
    color: "#4338ca",
  };
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
  const [sortBy, setSortBy] = useState("patient_id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showAdd, setShowAdd] = useState(false);
  const [readPatient, setReadPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);

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

      console.log("PATIENT DATA:", data);

      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deletePatient(id) {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await fetch(`${URL}/api/patients/${id}`, {
        method: "DELETE",
      });

      fetchPatients();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function deleteSelected() {
    if (
      !selected.size ||
      !window.confirm(`Delete ${selected.size} patient(s)?`)
    ) {
      return;
    }

    try {
      await Promise.all(
        [...selected].map((id) =>
          fetch(`${URL}/api/patients/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      setSelected(new Set());
      fetchPatients();
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  }

  async function deleteAll() {
    if (!patients.length || !window.confirm("Delete ALL patients?")) {
      return;
    }

    try {
      await fetch(`${URL}/api/deleteAll`, {
        method: "DELETE",
      });

      setSelected(new Set());
      fetchPatients();
    } catch (err) {
      console.error("Delete all failed:", err);
    }
  }

  function toggleRow(id) {
    setSelected((prev) => {
      const s = new Set(prev);

      if (s.has(id)) {
        s.delete(id);
      } else {
        s.add(id);
      }

      return s;
    });
  }

  function toggleAll(e) {
    setSelected(
      e.target.checked ? new Set(sorted.map((p) => p.patient_id)) : new Set(),
    );
  }

  const filtered = patients.filter((p) =>
    [
      p.patient_name,
      p.phone,
      p.address,
      p.gender,
      p.medical_condition,
      p.blood_type,
      p.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === "patient_id") {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
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

        <div style={sidebarStyles.sidebarFooter}>
          <p style={sidebarStyles.footerText}>
            Hospital Management
            <br />
            System v1.0
          </p>
        </div>
      </aside>

      {/* MAIN */}
      <main
        style={{
          marginLeft: "220px",
          padding: "32px 28px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "24px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            Patients
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            Manage all registered patients
          </p>
        </div>

        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {/* SEARCH */}
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "280px",
              maxWidth: "420px",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              🔍
            </span>

            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 36px",
                border: "1px solid #dbe2ea",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={deleteAll}
              disabled={!patients.length}
              style={{
                padding: "9px 14px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                background: "#fff",
                color: "#ef4444",
                fontSize: "13px",
                fontWeight: "600",
                cursor: patients.length ? "pointer" : "not-allowed",
                opacity: patients.length ? 1 : 0.5,
              }}
            >
              🗑 Delete All
            </button>

            <button
              onClick={() => setShowAdd(true)}
              style={{
                padding: "9px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              ＋ Add Patient
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            width: "100%",
          }}
        >
          {/* CARD HEADER */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#0f172a",
              }}
            >
              All Patients
            </span>

            <span
              style={{
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              {sorted.length} record
              {sorted.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* SELECTED BAR */}
          {selected.size > 0 && (
            <div
              style={{
                padding: "12px 20px",
                background: "#eff6ff",
                borderBottom: "1px solid #bfdbfe",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "#1e40af",
                  fontWeight: "500",
                }}
              >
                {selected.size} selected
              </span>

              <button
                onClick={deleteSelected}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #fecaca",
                  background: "#fff",
                  color: "#ef4444",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Delete Selected
              </button>
            </div>
          )}

          {/* TABLE */}
          {loading ? (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Loading...
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        ...TH,
                        width: "60px",
                        textAlign: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        onChange={toggleAll}
                        checked={
                          sorted.length > 0 &&
                          sorted.every((p) => selected.has(p.patient_id))
                        }
                        style={{
                          cursor: "pointer",
                          accentColor: "#2563eb",
                        }}
                      />
                    </th>

                    <th style={{ ...TH, width: "80px", cursor: "pointer" }} onClick={() => { setSortBy('patient_id'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>ID {sortBy === 'patient_id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={{ ...TH, width: "18%", cursor: "pointer" }} onClick={() => { setSortBy('patient_name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Name {sortBy === 'patient_name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={{ ...TH, width: "12%" }}>Phone</th>
                    <th style={{ ...TH, width: "10%" }}>Gender</th>
                    <th style={{ ...TH, width: "18%" }}>Address</th>
                    <th style={{ ...TH, width: "20%" }}>Condition</th>
                    <th style={{ ...TH, width: "10%" }}>Blood Type</th>
                    <th style={{ ...TH, width: "10%" }}>Status</th>
                    <th style={{ ...TH, width: "20%" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sorted.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          padding: "40px",
                          textAlign: "center",
                          color: "#94a3b8",
                        }}
                      >
                        No patients found.
                      </td>
                    </tr>
                  ) : (
                    sorted.map((p) => (
                      <tr
                        key={p.patient_id}
                        style={{
                          background: selected.has(p.patient_id)
                            ? "#f8fbff"
                            : "#fff",
                        }}
                      >
                        {/* CHECKBOX */}
                        <td
                          style={{
                            ...TD,
                            textAlign: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selected.has(p.patient_id)}
                            onChange={() => toggleRow(p.patient_id)}
                            style={{
                              cursor: "pointer",
                              accentColor: "#2563eb",
                            }}
                          />
                        </td>

                        {/* ID */}
                        <td
                          style={{
                            ...TD,
                            fontWeight: "600",
                            color: "#64748b",
                          }}
                        >
                          {p.patient_id}
                        </td>

                        {/* NAME */}
                        <td
                          style={{
                            ...TD,
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          {p.patient_name}
                        </td>

                        {/* PHONE */}
                        <td style={TD}>{p.phone || "-"}</td>

                        {/* GENDER */}
                        <td style={TD}>
                          <span
                            style={{
                              ...genderBadge(p.gender),
                              padding: "5px 10px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: "600",
                              display: "inline-block",
                              textTransform: "capitalize",
                            }}
                          >
                            {p.gender || "-"}
                          </span>
                        </td>

                        {/* ADDRESS */}
                        <td style={TD}>{p.address || "-"}</td>

                        {/* CONDITION */}
                        <td style={TD}>{p.medical_condition || "-"}</td>

                        {/* BLOOD TYPE */}
                        <td style={TD}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "999px",
                              background: "#fee2e2",
                              color: "#b91c1c",
                              fontWeight: "700",
                              fontSize: "12px",
                              display: "inline-block",
                            }}
                          >
                            {p.blood_type || "-"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td style={TD}>{p.status || "-"}</td>

                        {/* ACTIONS */}
                        <td style={TD}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              flexWrap: "nowrap",
                            }}
                          >
                            {/* VIEW */}
                            <button
                              onClick={() => setReadPatient(p)}
                              style={{
                                padding: "7px 12px",
                                borderRadius: "7px",
                                border: "1px solid #dbe2ea",
                                background: "#fff",
                                color: "#3b82f6",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaEye /> View
                            </button>

                            {/* EDIT */}
                            <button
                              onClick={() => setEditPatient(p)}
                              style={{
                                padding: "7px 12px",
                                borderRadius: "7px",
                                border: "1px solid #bfdbfe",
                                background: "#eff6ff",
                                color: "#14b8a6",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaPen /> Edit
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() => deletePatient(p.patient_id)}
                              style={{
                                padding: "7px 12px",
                                borderRadius: "7px",
                                border: "1px solid #fecaca",
                                background: "#fef2f2",
                                color: "#ef4444",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* CREATE MODAL */}
      {showAdd && (
        <CreatePatientModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            fetchPatients();
          }}
        />
      )}

      {/* READ MODAL */}
      {readPatient && (
        <ReadPatientModal
          patient={readPatient}
          onClose={() => setReadPatient(null)}
          onEdit={() => {
            setEditPatient(readPatient);
            setReadPatient(null);
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editPatient && (
        <EditPatientModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
          onSaved={() => {
            setEditPatient(null);
            fetchPatients();
          }}
        />
      )}
    </div>
  );
}
