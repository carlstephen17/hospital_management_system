import React, { useState } from "react";
import CreateModal from "../homeModals/CreateModal";

const styles = {
  wrapper: {
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    color: "#1a202c",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e2e8f0",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#1a56db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
  },

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a202c",
  },

  subtitle: {
    margin: "2px 0 0",
    fontSize: "12px",
    color: "#64748b",
  },

  headerActions: {
    display: "flex",
    gap: "10px",
  },

  btnPrimary: {
    background: "#1a56db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },

  btnSecondary: {
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },

  btnDanger: {
    background: "#fff",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },

  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#fff",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1100px",
    fontSize: "13px",
  },

  thead: {
    background: "#f8fafc",
  },

  th: {
    padding: "12px 14px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "11px",
    color: "#64748b",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #f1f5f9",
    color: "#374151",
  },

  emptyRow: {
    textAlign: "center",
    padding: "48px",
    color: "#94a3b8",
  },

  actionGroup: {
    display: "flex",
    gap: "6px",
  },

  btnRead: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    padding: "5px 10px",
    fontSize: "12px",
    cursor: "pointer",
  },

  btnEdit: {
    background: "#f0fdf4",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    padding: "5px 10px",
    fontSize: "12px",
    cursor: "pointer",
  },

  btnDelete: {
    background: "#fff1f2",
    color: "#be123c",
    border: "1px solid #fecdd3",
    borderRadius: "6px",
    padding: "5px 10px",
    fontSize: "12px",
    cursor: "pointer",
  },
};

function UNF({
  patients,
  setPatients,
  fetchPatients,
  doctors,
  appointments,
  bills,
  treatments,
  departments,
  patientTreatments,
  getDoctorForPatient,
  navigate,
  handleDelete,
  handleDeleteAll,
}) {
  const [openCreate, setOpenCreate] = useState(false);

  const handleCreated = async () => {
    setOpenCreate(false);

    if (fetchPatients && setPatients) {
      const data = await fetchPatients();
      setPatients(data);
    }
  };

  return (
    <div style={styles.wrapper}>

      {openCreate && (
        <CreateModal
          onClose={() => setOpenCreate(false)}
          onCreated={handleCreated}
        />
      )}

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoCircle}>H+</div>
          <div>
            <h2 style={styles.title}>Patient Records</h2>
            <p style={styles.subtitle}>Hospital Management System</p>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.btnSecondary} onClick={() => navigate("/reports")}>
            📊 Reports
          </button>

          <button style={styles.btnDanger} onClick={handleDeleteAll}>
            🗑️ Delete All
          </button>

          <button style={styles.btnPrimary} onClick={() => setOpenCreate(true)}>
            ➕ Add Patient
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Patient ID</th>
              <th style={styles.th}>Patient Name</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Gender</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Condition</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Doctor ID</th>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Specialty</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Schedule</th>
              <th style={styles.th}>Treatment</th>
              <th style={styles.th}>Bill</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients?.length === 0 ? (
              <tr>
                <td colSpan={16} style={styles.emptyRow}>
                  No patient records found
                </td>
              </tr>
            ) : (
              patients?.map((p) => {
                const doctor = getDoctorForPatient?.(p.patient_id) || {};
                const department = departments?.find(
                  (d) => String(d.department_id) === String(doctor.department_id)
                );

                const appointment = appointments?.find(
                  (a) => String(a.patient_id) === String(p.patient_id)
                );

                const patientTreats = patientTreatments?.filter(
                  (pt) => String(pt.patient_id) === String(p.patient_id)
                );

                const treatmentNames = patientTreats
                  ?.map((pt) => {
                    const t = treatments?.find(
                      (x) => String(x.treatment_id) === String(pt.treatment_id)
                    );
                    return t ? t.treatment_name : "Unknown";
                  })
                  .join(", ");

                const patientBills = bills?.filter(
                  (b) => String(b.patient_id) === String(p.patient_id)
                );

                const totalCost = patientBills?.reduce(
                  (sum, b) => sum + Number(b.amount || 0),
                  0
                );

                return (
                  <tr key={p.patient_id}>
                    <td style={styles.td}>{p.patient_id}</td>
                    <td style={styles.td}>{p.patient_name}</td>
                    <td style={styles.td}>{p.phone}</td>
                    <td style={styles.td}>{p.gender}</td>
                    <td style={styles.td}>{p.address}</td>
                    <td style={styles.td}>{p.condition}</td>
                    <td style={styles.td}>{p.status}</td>

                    <td style={styles.td}>{doctor.doctor_id || "—"}</td>
                    <td style={styles.td}>{doctor.doctor_name || "—"}</td>
                    <td style={styles.td}>{doctor.doctor_specialty || "—"}</td>

                    <td style={styles.td}>
                      {department?.department_name || "—"}
                    </td>

                    <td style={styles.td}>
                      {department?.location || "—"}
                    </td>

                    <td style={styles.td}>
                      {appointment?.appointment_date || "—"}
                    </td>

                    <td style={styles.td}>{treatmentNames || "—"}</td>

                    <td style={styles.td}>
                      ₱{totalCost?.toFixed(0) || 0}
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actionGroup}>
                        <button style={styles.btnRead}>View</button>
                        <button style={styles.btnEdit}>Edit</button>
                        <button
                          style={styles.btnDelete}
                          onClick={() => handleDelete(p.patient_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UNF;