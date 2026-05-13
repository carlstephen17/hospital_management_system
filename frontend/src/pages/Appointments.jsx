import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarStyles, navItems } from "../components/sideBar";

import CreateAppointmentModal from "../CRUD/CRUD_Appointments/CreateAppointmentModal";
import ReadAppointmentModal from "../CRUD/CRUD_Appointments/ReadAppointmentModal";
import EditAppointmentModal from "../CRUD/CRUD_Appointments/EditAppointmentModal";

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

const statusStyle = (status) => {
  const s = status?.toLowerCase();

  if (s === "admitted") return { background: "#dcfce7", color: "#166534" };
  if (s === "discharged") return { background: "#dbeafe", color: "#1e3a8a" };
  if (s === "deceased") return { background: "#fee2e2", color: "#991b1b" };
  if (s === "critical") return { background: "#fef3c7", color: "#92400e" };
  if (s === "recovered") return { background: "#e0e7ff", color: "#3730a3" };

  return { background: "#e5e7eb", color: "#111827" };
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());

  const [showAdd, setShowAdd] = useState(false);
  const [readAppointment, setReadAppointment] = useState(null);
  const [editAppointment, setEditAppointment] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setLoading(true);

      const [aRes, pRes, dRes] = await Promise.all([
        fetch(`${URL}/api/appointments`),
        fetch(`${URL}/api/patients`),
        fetch(`${URL}/api/doctors`),
      ]);

      const [aData, pData, dData] = await Promise.all([
        aRes.json(),
        pRes.json(),
        dRes.json(),
      ]);

      setAppointments(Array.isArray(aData) ? aData : []);
      setPatients(Array.isArray(pData) ? pData : []);
      setDoctors(Array.isArray(dData) ? dData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getPatientName = (id) =>
    patients.find((p) => p.patient_id === id)?.patient_name || "Unknown";

  const getDoctorName = (id) =>
    doctors.find((d) => d.doctor_id === id)?.doctor_name || "Unknown";

  function toggleRow(id) {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function toggleAll(e) {
    setSelected(
      e.target.checked
        ? new Set(filtered.map((a) => a.appointment_id))
        : new Set(),
    );
  }

  async function deleteAppointment(id) {
    if (!window.confirm("Delete this appointment?")) return;

    await fetch(`${URL}/api/appointments/${id}`, { method: "DELETE" });

    setSelected((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });

    fetchAll();
  }

  async function deleteAll() {
    if (!appointments.length || !window.confirm("Delete ALL appointments?"))
      return;

    await Promise.all(
      appointments.map((a) =>
        fetch(`${URL}/api/appointments/${a.appointment_id}`, {
          method: "DELETE",
        }),
      ),
    );

    setSelected(new Set());
    fetchAll();
  }

  const filtered = appointments.filter((a) =>
    [
      getPatientName(a.patient_id),
      getDoctorName(a.doctor_id),
      a.status,
      a.appointment_date,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* SIDEBAR (same as doctors) */}
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
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>
            Appointments
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            Manage all scheduled appointments
          </p>
        </div>

        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <input
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "280px",
              maxWidth: "420px",
              padding: "10px 14px",
              border: "1px solid #dbe2ea",
              borderRadius: "8px",
            }}
          />

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={deleteAll}
              style={{
                padding: "9px 14px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                background: "#fff",
                color: "#ef4444",
                fontSize: "13px",
                fontWeight: "600",
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
              }}
            >
              ＋ Add Appointment
            </button>
          </div>
        </div>

        {/* TABLE */}
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
            }}
          >
            <span style={{ fontWeight: 600 }}>All Appointments</span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {filtered.length} records
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "50px", textAlign: "center" }}>
              Loading...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ ...TH, width: 60, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        onChange={toggleAll}
                        checked={
                          filtered.length > 0 &&
                          filtered.every((a) => selected.has(a.appointment_id))
                        }
                      />
                    </th>
                    <th style={TH}>ID</th>
                    <th style={TH}>Patient</th>
                    <th style={TH}>Doctor</th>
                    <th style={TH}>Date</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.appointment_id}>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selected.has(a.appointment_id)}
                          onChange={() => toggleRow(a.appointment_id)}
                        />
                      </td>

                      <td style={TD}>{a.appointment_id}</td>
                      <td style={TD}>{getPatientName(a.patient_id)}</td>
                      <td style={TD}>{getDoctorName(a.doctor_id)}</td>
                      <td style={TD}>{a.appointment_date}</td>

                      <td style={TD}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 600,
                            ...statusStyle(a.status),
                          }}
                        >
                          {a.status}
                        </span>
                      </td>

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
                            onClick={() => setReadAppointment(a)}
                            style={{
                              padding: "7px 12px",
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
                            onClick={() => setEditAppointment(a)}
                            style={{
                              padding: "7px 12px",
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
                            onClick={() => deleteAppointment(a.appointment_id)}
                            style={{
                              padding: "7px 12px",
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
      {showAdd && (
        <CreateAppointmentModal
          onClose={() => setShowAdd(false)}
          onSaved={fetchAll}
        />
      )}

      {readAppointment && (
        <ReadAppointmentModal
          appointment={readAppointment}
          onClose={() => setReadAppointment(null)}
        />
      )}

      {editAppointment && (
        <EditAppointmentModal
          appointment={editAppointment}
          onClose={() => setEditAppointment(null)}
          onSaved={() => {
            setEditAppointment(null);
            fetchAll();
          }}
        />
      )}
    </div>
  );
}

export default Appointments;
