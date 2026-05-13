import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { URL } from "../API";
import { sidebarStyles, navItems } from "./SideBar";

function Reports() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartesian, setCartesian] = useState([]);
  const [unionData, setUnionData] = useState([]);
  const [difference, setDifference] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReports = () => {
    setLoading(true);

    fetch(`${URL}/api/reports/cartesian`)
      .then((res) => res.json())
      .then((data) => setCartesian(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Cartesian error:", err));

    fetch(`${URL}/api/reports/union`)
      .then((res) => res.json())
      .then((data) => setUnionData(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Union error:", err));

    fetch(`${URL}/api/reports/difference`)
      .then((res) => res.json())
      .then((data) => setDifference(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Difference error:", err))
      .finally(() => setLoading(false));
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

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
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
            Reports
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            View advanced SQL reports for project requirements.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#475569",
              fontSize: "14px",
              maxWidth: "720px",
            }}
          >
            Generate the Cartesian, UNION, and SET DIFFERENCE reports for
            hospital data.
          </p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={loadReports}
              disabled={loading}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Loading..." : "Load Reports"}
            </button>
          </div>
        </div>

        <section
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "22px 24px",
            boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
          }}
        >
          <div style={{ marginBottom: "22px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Advanced SQL Reports
            </h2>
            <p
              style={{ margin: "8px 0 0", color: "#475569", fontSize: "13px" }}
            >
              These reports use Cartesian product, UNION, and difference logic
              to inspect hospital data.
            </p>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 700 }}
            >
              1. Cartesian Product
            </h3>
            <p style={{ margin: 0, color: "#475569", fontSize: "13px" }}>
              Doctors × Patients (with condition)
            </p>
            <div style={{ overflowX: "auto", marginTop: "16px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th style={TH}>Doctor Name</th>
                    <th style={TH}>Patient Name</th>
                    <th style={TH}>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {cartesian.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        style={{ ...TD, textAlign: "center", padding: "24px" }}
                      >
                        No data yet. Click Load Reports.
                      </td>
                    </tr>
                  ) : (
                    cartesian.map((row, index) => (
                      <tr key={index}>
                        <td style={TD}>{row.doctor_name}</td>
                        <td style={TD}>{row.patient_name}</td>
                        <td style={TD}>{row.medical_condition}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 700 }}
            >
              2. UNION
            </h3>
            <p style={{ margin: 0, color: "#475569", fontSize: "13px" }}>
              Patients who had Treatment
            </p>
            <div style={{ overflowX: "auto", marginTop: "16px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th style={TH}>Patient ID</th>
                    <th style={TH}>Patient Name</th>
                    <th style={TH}>Treatment</th>
                  </tr>
                </thead>
                <tbody>
                  {unionData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        style={{ ...TD, textAlign: "center", padding: "24px" }}
                      >
                        No data yet. Click Load Reports.
                      </td>
                    </tr>
                  ) : (
                    unionData.map((row, index) => (
                      <tr key={index}>
                        <td style={TD}>{row.patient_id}</td>
                        <td style={TD}>{row.patient_name}</td>
                        <td style={TD}>{row.treatment_name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3
              style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 700 }}
            >
              3. SET DIFFERENCE
            </h3>
            <p style={{ margin: 0, color: "#475569", fontSize: "13px" }}>
              Patients with Appointment but unpaid bill status
            </p>
            <div style={{ overflowX: "auto", marginTop: "16px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th style={TH}>Patient ID</th>
                    <th style={TH}>Patient Name</th>
                    <th style={TH}>Bill Status</th>
                  </tr>
                </thead>
                <tbody>
                  {difference.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        style={{ ...TD, textAlign: "center", padding: "24px" }}
                      >
                        No data yet. Click Load Reports.
                      </td>
                    </tr>
                  ) : (
                    difference.map((row, index) => (
                      <tr key={index}>
                        <td style={TD}>{row.patient_id}</td>
                        <td style={TD}>{row.patient_name}</td>
                        <td style={TD}>{row.status || "Unpaid"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;
