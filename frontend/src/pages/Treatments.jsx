import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarStyles, navItems } from "../components/SideBar";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import CreateTreatmentModal from "../CRUD/CRUD_Treatments/CreateTreatmentModal";
import EditTreatmentModal from "../CRUD/CRUD_Treatments/EditTreatmentModal";
import ReadTreatmentModal from "../CRUD/CRUD_Treatments/ReadTreatmentModal";

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

export default function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [sortBy, setSortBy] = useState("treatment_id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showAdd, setShowAdd] = useState(false);
  const [viewTreatment, setViewTreatment] = useState(null);
  const [editTreatment, setEditTreatment] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [tRes, dRes] = await Promise.all([
        fetch(`${URL}/api/treatments`),
        fetch(`${URL}/api/departments`),
      ]);
      const [tData, dData] = await Promise.all([tRes.json(), dRes.json()]);
      setTreatments(Array.isArray(tData) ? tData : []);
      setDepartments(Array.isArray(dData) ? dData : []);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTreatment(id) {
    if (!window.confirm("Delete this treatment?")) return;
    await fetch(`${URL}/api/treatments/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function deleteSelected() {
    if (!selected.size || !window.confirm(`Delete ${selected.size} treatment(s)?`)) return;
    await Promise.all(
      [...selected].map((id) => fetch(`${URL}/api/treatments/${id}`, { method: "DELETE" }))
    );
    setSelected(new Set());
    fetchAll();
  }

  async function deleteAll() {
    if (!treatments.length || !window.confirm("Delete ALL treatments?")) return;
    await Promise.all(
      treatments.map((t) =>
        fetch(`${URL}/api/treatments/${t.treatment_id}`, { method: "DELETE" })
      )
    );
    setSelected(new Set());
    fetchAll();
  }

  function toggleRow(id) {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function toggleAll(e) {
    setSelected(
      e.target.checked ? new Set(sorted.map((t) => t.treatment_id)) : new Set(),
    );
  }

  const getDeptName = (dept_id) =>
    departments.find((d) => String(d.department_id) === String(dept_id))
      ?.department_name || "—";

  const filtered = treatments.filter((t) =>
    [t.treatment_name, t.description, t.cost, getDeptName(t.department_id)]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === "treatment_id") {
      aVal = a.treatment_id;
      bVal = b.treatment_id;
    } else if (sortBy === "treatment_name") {
      aVal = a.treatment_name.toLowerCase();
      bVal = b.treatment_name.toLowerCase();
    }
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
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
      {/* Sidebar */}
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
                ...(location.pathname === item.path ? sidebarStyles.navBtnActive : {}),
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

      {/* Main content */}
      <main
        style={{
          marginLeft: "220px",
          padding: "32px 28px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "24px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            Treatments
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            Manage all registered Treatments
          </p>
        </div>

        {/* Toolbar */}
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
              placeholder="Search treatments..."
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
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={deleteAll}
              disabled={!treatments.length}
              style={{
                padding: "9px 14px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                background: "#fff",
                color: "#ef4444",
                fontSize: "13px",
                fontWeight: "600",
                cursor: treatments.length ? "pointer" : "not-allowed",
                opacity: treatments.length ? 1 : 0.5,
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
              ＋ Add Treatment
            </button>
          </div>
        </div>

        {/* Table card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            width: "100%",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>
              All Treatments
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {sorted.length} record{sorted.length !== 1 ? "s" : ""}
            </span>
          </div>

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
              <span style={{ fontSize: "13px", color: "#1e40af", fontWeight: "500" }}>
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

          {loading ? (
            <div style={{ padding: "50px", textAlign: "center", color: "#94a3b8" }}>
              Loading...
            </div>
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
                    <th style={{ ...TH, width: "60px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        onChange={toggleAll}
                        checked={
                          filtered.length > 0 &&
                          sorted.every((t) => selected.has(t.treatment_id))
                        }
                        style={{ cursor: "pointer", accentColor: "#2563eb" }}
                      />
                    </th>
                    <th
                      style={{ ...TH, width: "70px", cursor: "pointer" }}
                      onClick={() => {
                        if (sortBy === "treatment_id") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("treatment_id");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      ID {sortBy === "treatment_id" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      style={{ ...TH, width: "22%", cursor: "pointer" }}
                      onClick={() => {
                        if (sortBy === "treatment_name") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("treatment_name");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Treatment Name {sortBy === "treatment_name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th style={{ ...TH, width: "28%" }}>Description</th>
                    <th style={{ ...TH, width: "12%" }}>Cost</th>
                    <th style={{ ...TH, width: "18%" }}>Department</th>
                    <th style={{ ...TH, width: "20%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}
                      >
                        No treatments found.
                      </td>
                    </tr>
                  ) : (
                    sorted.map((t) => (
                      <tr
                        key={t.treatment_id}
                        style={{
                          background: selected.has(t.treatment_id) ? "#f8fbff" : "#fff",
                        }}
                      >
                        <td style={{ ...TD, textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={selected.has(t.treatment_id)}
                            onChange={() => toggleRow(t.treatment_id)}
                            style={{ cursor: "pointer", accentColor: "#2563eb" }}
                          />
                        </td>
                        <td style={{ ...TD, fontWeight: "600", color: "#64748b" }}>
                          {t.treatment_id}
                        </td>
                        <td style={{ ...TD, fontWeight: "600", color: "#0f172a" }}>
                          {t.treatment_name}
                        </td>
                        <td
                          style={{
                            ...TD,
                            whiteSpace: "normal",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "260px",
                          }}
                        >
                          {t.description || "—"}
                        </td>
                        <td style={{ ...TD, color: "#16a34a", fontWeight: "600" }}>
                          {t.cost
                            ? `₱ ${Number(t.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                            : "—"}
                        </td>
                        <td style={TD}>{getDeptName(t.department_id)}</td>
                        <td style={TD}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              flexWrap: "nowrap",
                            }}
                          >
                            <button
                              onClick={() => setViewTreatment(t)}
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
                            <button
                              onClick={() => setEditTreatment(t)}
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
                            <button
                              onClick={() => deleteTreatment(t.treatment_id)}
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

      {/* Modals */}
      {showAdd && (
        <CreateTreatmentModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            fetchAll();
          }}
        />
      )}
      {viewTreatment && (
        <ReadTreatmentModal
          treatment={viewTreatment}
          departments={departments}
          onClose={() => setViewTreatment(null)}
          onEdit={() => {
            setEditTreatment(viewTreatment);
            setViewTreatment(null);
          }}
        />
      )}
      {editTreatment && (
        <EditTreatmentModal
          treatment={editTreatment}
          onClose={() => setEditTreatment(null)}
          onSaved={() => {
            setEditTreatment(null);
            fetchAll();
          }}
        />
      )}
    </div>
  );
}