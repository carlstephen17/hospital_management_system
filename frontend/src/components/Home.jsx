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
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },
  analysisCard: {
    background: "#fff",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    minHeight: "260px",
    display: "flex",
    flexDirection: "column",
  },
  sectionHeader: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 16px",
  },
  progressRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    marginBottom: "14px",
  },
  progressLabel: {
    fontSize: "13px",
    color: "#334155",
    margin: 0,
    fontWeight: 600,
  },
  progressValue: {
    fontSize: "13px",
    color: "#64748b",
    minWidth: "48px",
    textAlign: "right",
  },
  barOuter: {
    height: "10px",
    background: "#eef2ff",
    borderRadius: "999px",
    overflow: "hidden",
    marginTop: "8px",
  },
  barInner: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "999px",
  },
  miniList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: "12px",
  },
  miniListItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#f8fafc",
  },
  miniLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#475569",
  },
  miniValue: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: "#0f172a",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: 0,
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
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch(`${URL}/api/analytics`);
      if (!res.ok) throw new Error("Analytics request failed");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    {
      label: "Total Patients",
      value: analytics?.total_patients ?? 0,
      sub: "Registered patients",
    },
    {
      label: "Critical Patients",
      value: analytics?.critical_patients ?? 0,
      sub: "Needs immediate attention",
    },
    {
      label: "Doctors",
      value: analytics?.total_doctors ?? 0,
      sub: "Available specialists",
    },
    {
      label: "Appointments",
      value: analytics?.total_appointments ?? 0,
      sub: "Upcoming schedules",
    },
  ];

  const genderData = analytics?.gender_distribution ?? [];
  const statusData = analytics?.status_distribution ?? [];
  const topConditions = analytics?.top_conditions ?? [];
  const billSummary = analytics ? {
    total: analytics.total_bills ?? 0,
    amount: analytics.total_amount ?? 0,
    paid: analytics.paid_bills ?? 0,
    unpaid: analytics.unpaid_bills ?? 0,
  } : null;
  const appointmentDoctors = analytics?.appointments_by_doctor ?? [];

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

        <div style={mainStyles.summaryGrid}>
          <section style={mainStyles.analysisCard}>
            <p style={mainStyles.sectionHeader}>Gender distribution</p>
            {loading ? (
              <p style={mainStyles.emptyText}>Loading analytics...</p>
            ) : genderData.length ? (
              genderData.map((row) => (
                <div key={row.gender} style={mainStyles.progressRow}>
                  <div style={{ flex: 1 }}>
                    <p style={mainStyles.progressLabel}>{row.gender}</p>
                    <div style={mainStyles.barOuter}>
                      <div
                        style={{
                          ...mainStyles.barInner,
                          width: `${row.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p style={mainStyles.progressValue}>
                    {row.count} ({row.percentage}%)
                  </p>
                </div>
              ))
            ) : (
              <p style={mainStyles.emptyText}>No gender data available.</p>
            )}
          </section>

          <section style={mainStyles.analysisCard}>
            <p style={mainStyles.sectionHeader}>Patient status</p>
            {loading ? (
              <p style={mainStyles.emptyText}>Loading analytics...</p>
            ) : statusData.length ? (
              statusData.map((row) => (
                <div key={row.status} style={mainStyles.progressRow}>
                  <div style={{ flex: 1 }}>
                    <p style={mainStyles.progressLabel}>{row.status}</p>
                    <div style={mainStyles.barOuter}>
                      <div
                        style={{
                          ...mainStyles.barInner,
                          width: `${row.percentage}%`,
                          background: "#22c55e",
                        }}
                      />
                    </div>
                  </div>
                  <p style={mainStyles.progressValue}>
                    {row.count} ({row.percentage}%)
                  </p>
                </div>
              ))
            ) : (
              <p style={mainStyles.emptyText}>No patient status data available.</p>
            )}
          </section>

          <section style={mainStyles.analysisCard}>
            <p style={mainStyles.sectionHeader}>Billing summary</p>
            {loading ? (
              <p style={mainStyles.emptyText}>Loading analytics...</p>
            ) : billSummary ? (
              <ul style={mainStyles.miniList}>
                <li style={mainStyles.miniListItem}>
                  <p style={mainStyles.miniLabel}>Total bills</p>
                  <p style={mainStyles.miniValue}>{billSummary.total}</p>
                </li>
                <li style={mainStyles.miniListItem}>
                  <p style={mainStyles.miniLabel}>Paid bills</p>
                  <p style={mainStyles.miniValue}>{billSummary.paid}</p>
                </li>
                <li style={mainStyles.miniListItem}>
                  <p style={mainStyles.miniLabel}>Unpaid bills</p>
                  <p style={mainStyles.miniValue}>{billSummary.unpaid}</p>
                </li>
                <li style={mainStyles.miniListItem}>
                  <p style={mainStyles.miniLabel}>Total billed amount</p>
                  <p style={mainStyles.miniValue}>${billSummary.amount}</p>
                </li>
              </ul>
            ) : (
              <p style={mainStyles.emptyText}>No billing data available.</p>
            )}
          </section>

          <section style={mainStyles.analysisCard}>
            <p style={mainStyles.sectionHeader}>Top patient conditions</p>
            {loading ? (
              <p style={mainStyles.emptyText}>Loading analytics...</p>
            ) : topConditions.length ? (
              <ul style={mainStyles.miniList}>
                {topConditions.map((row) => (
                  <li key={row.condition_name} style={mainStyles.miniListItem}>
                    <p style={mainStyles.miniLabel}>{row.condition_name}</p>
                    <p style={mainStyles.miniValue}>{row.count}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={mainStyles.emptyText}>No condition data available.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
