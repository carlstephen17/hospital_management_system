import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate, useLocation } from "react-router-dom";

const sidebarStyles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    backgroundColor: "#0f172a",
    padding: "0",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1e293b",
    zIndex: 100,
  },
  sidebarBrand: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid #1e293b",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  brandIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "#1a56db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },
  brandName: {
    color: "#f1f5f9",
    fontWeight: "600",
    fontSize: "15px",
    margin: 0,
    lineHeight: 1.2,
  },
  brandSub: {
    color: "#64748b",
    fontSize: "11px",
    margin: "2px 0 0",
  },
  navSection: {
    padding: "16px 12px 8px",
    flex: 1,
  },
  navLabel: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "0 8px",
    marginBottom: "8px",
    display: "block",
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "9px 12px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "left",
    marginBottom: "2px",
  },
  navBtnActive: {
    background: "#1e293b",
    color: "#e2e8f0",
  },
  navIcon: {
    fontSize: "15px",
    width: "18px",
    textAlign: "center",
  },
  sidebarFooter: {
    padding: "16px 20px",
    borderTop: "1px solid #1e293b",
  },
  footerText: {
    color: "#475569",
    fontSize: "11px",
    margin: 0,
    lineHeight: 1.5,
  },
};

const mainStyles = {
  page: {
    display: "flex",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  main: {
    marginLeft: "220px",
    padding: "32px 28px",
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  pageHeader: {
    marginBottom: "28px",
  },
  pageTitle: {
    margin: "0 0 4px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  },
  pageSub: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "18px 20px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
    margin: "0 0 6px",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  statSub: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "6px 0 0",
  },
};

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/" },
  { icon: "🧾", label: "Bills", path: "/bills" },
  { icon: "👨‍⚕️", label: "Patients", path: "/patients" },
  { icon: "👨‍⚕️", label: "Doctors", path: "/doctors" },
  { icon: "📅", label: "Appointments", path: "/appointments" },
  { icon: "💊", label: "Treatments", path: "/treatments" },
  { icon: "📊", label: "Reports", path: "/reports" },
];

function Home() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [patientsData, doctorsData, appointmentsData, billsData] =
        await Promise.all([
          fetch(`${URL}/api/patients`).then((r) => r.json()),
          fetch(`${URL}/api/doctors`).then((r) => r.json()),
          fetch(`${URL}/api/appointments`).then((r) => r.json()),
          fetch(`${URL}/api/bills`).then((r) => r.json()),
        ]);

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setBills(Array.isArray(billsData) ? billsData : []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }

  const paidBills = bills.filter(
    (b) => b.status?.toLowerCase() === "paid",
  ).length;

  const pendingBills = bills.filter(
    (b) => b.status?.toLowerCase() !== "paid",
  ).length;

  const stats = [
    {
      label: "Total Patients",
      value: patients.length,
      sub: "Registered records",
    },
    {
      label: "Doctors",
      value: doctors.length,
      sub: "Active staff",
    },
    {
      label: "Appointments",
      value: appointments.length,
      sub: "Scheduled",
    },
    {
      label: "Paid Bills",
      value: paidBills,
      sub: `${pendingBills} pending`,
    },
  ];

  return (
    <div style={mainStyles.page}>
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

      <main style={mainStyles.main}>
        <div style={mainStyles.pageHeader}>
          <h1 style={mainStyles.pageTitle}>Dashboard</h1>

          <p style={mainStyles.pageSub}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div style={mainStyles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} style={mainStyles.statCard}>
              <p style={mainStyles.statLabel}>{s.label}</p>

              <p style={mainStyles.statValue}>{s.value}</p>

              <p style={mainStyles.statSub}>{s.sub}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
