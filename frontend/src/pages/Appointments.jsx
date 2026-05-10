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

  if (s === "confirmed") return { background: "#dcfce7", color: "#166534" };
  if (s === "pending") return { background: "#fef9c3", color: "#854d0e" };
  if (s === "cancelled") return { background: "#fee2e2", color: "#991b1b" };

  return { background: "#e0e7ff", color: "#3730a3" };
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

  async function deleteSelected() {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} appointment(s)?`)) return;

    await Promise.all(
      [...selected].map((id) =>
        fetch(`${URL}/api/appointments/${id}`, { method: "DELETE" })
      )
    );

    setSelected(new Set());
    fetchAll();
  }

  async function deleteAll() {
    if (!appointments.length) return;
    if (!window.confirm("Delete ALL appointments?")) return;

    await Promise.all(
      appointments.map((a) =>
        fetch(`${URL}/api/appointments/${a.appointment_id}`, {
          method: "DELETE",
        })
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
      e.target.checked
        ? new Set(filtered.map((a) => a.appointment_id))
        : new Set()
    );
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
      .includes(search.toLowerCase())
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
      <main style={{ marginLeft: "220px", padding: "32px 28px", width: "100%" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
          Appointments
        </h1>

        <p style={{ fontSize: "14px", color: "#64748b" }}>
          Manage all scheduled appointments
        </p>

        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <input
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #dbe2ea",
              width: "320px",
            }}
          />

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={deleteAll} style={{ color: "red" }}>
              Delete All
            </button>

            <button
              onClick={() => setShowAdd(true)}
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "9px 14px",
                borderRadius: "8px",
              }}
            >
              + Add Appointment
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div style={{ marginTop: "16px", background: "#fff", borderRadius: "12px" }}>

          {/* HEADER ADDED */}
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
              All Appointments
            </span>

            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <p style={{ padding: "20px" }}>Loading...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, width: "60px", textAlign: "center" }}>
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
                        <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "600", ...statusStyle(a.status) }}>
                          {a.status}
                        </span>
                      </td>

                      {/* MATCHED DOCTORS ACTION STYLE */}
                      <td style={TD}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "nowrap",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <button
                            onClick={() => setReadAppointment(a)}
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
                            onClick={() => setEditAppointment(a)}
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
                            onClick={() => deleteAppointment(a.appointment_id)}
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
      {showAdd && (
        <CreateAppointmentModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            fetchAll();
          }}
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