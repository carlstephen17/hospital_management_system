const T = {
  bg:          "#0f1623",
  surface:     "#151e2d",
  surfaceHigh: "#1a2235",
  border:      "#1f2e47",
  accent:      "#3b82f6",
  accentSoft:  "rgba(59,130,246,0.14)",
  textPri:     "#e8eeff",
  textSec:     "#7a8fad",
  textMute:    "#3d4f6e",
  inputBg:     "#0d1420",
  errBg:       "#2a1010",
  errBorder:   "rgba(248,113,113,0.28)",
  errText:     "#f87171",
};

export const sidebarStyles = {
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
  brandSub: { color: "#64748b", fontSize: "11px", margin: "2px 0 0" },
  navSection: { padding: "16px 12px 8px", flex: 1 },
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
  navBtnActive: { background: "#1e293b", color: "#e2e8f0" },
  navIcon: { fontSize: "15px", width: "18px", textAlign: "center" },
  sidebarFooter: { padding: "16px 20px", borderTop: "1px solid #1e293b" },
  footerText: { color: "#475569", fontSize: "11px", margin: 0, lineHeight: 1.5 },
};

export const navItems = [
  { icon: "🏠", label: "Dashboard",    path: "/"             },
  { icon: "🧾", label: "Bills",        path: "/bills"        },
  { icon: "👨‍⚕️", label: "Patients",    path: "/patients"     },
  { icon: "🩺", label: "Doctors",      path: "/doctors"      },
  { icon: "📅", label: "Appointments", path: "/appointments" },
  { icon: "💊", label: "Treatments",   path: "/treatments"   },
  { icon: "📊", label: "Reports",      path: "/reports"      },
];

export const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(4, 7, 16, 0.75)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    animation: "pm-fadeIn 0.18s ease",
  },
  modal: {
    width: "680px",
    maxWidth: "96vw",
    maxHeight: "92vh",
    overflowY: "auto",
    background: T.bg,
    border: `1px solid ${T.border}`,
    borderRadius: "16px",
    boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px ${T.accentSoft}`,
    animation: "pm-slideUp 0.22s cubic-bezier(0.16,1,0.3,1)",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 26px 18px",
    borderBottom: `1px solid ${T.border}`,
    position: "sticky",
    top: 0,
    background: T.bg,
    zIndex: 2,
    borderRadius: "16px 16px 0 0",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  titleIcon: {
    width: 34,
    height: 34,
    background: T.accentSoft,
    border: "1px solid rgba(59,130,246,0.3)",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: T.textPri,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  closeBtn: {
    background: "transparent",
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    color: T.textSec,
    width: 32,
    height: 32,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    flexShrink: 0,
    fontFamily: "inherit",
  },
  body: {
    padding: "22px 26px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "16px 26px 22px",
    borderTop: `1px solid ${T.border}`,
  },

  row: {
    display: "flex",
    gap: 14,
    marginBottom: 14,
  },
  fullRow: {
    marginBottom: 14,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "14px",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginBottom: "14px",
  },

  label: {
    marginBottom: 6,
    fontSize: 11.5,
    fontWeight: 700,
    color: T.textSec,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  requiredDot: {
    color: T.accent,
    marginLeft: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: T.textMute,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 12,
    marginTop: 4,
  },

  input: {
    width: "100%",
    padding: "10px 13px",
    background: T.inputBg,
    border: `1px solid ${T.border}`,
    borderRadius: 9,
    color: T.textPri,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
    appearance: "none",
    WebkitAppearance: "none",
  },
  select: {
    width: "100%",
    padding: "10px 13px",
    background: T.inputBg,
    border: `1px solid ${T.border}`,
    borderRadius: 9,
    color: T.textPri,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
    appearance: "none",
    WebkitAppearance: "none",
  },

  errBox: {
    background: T.errBg,
    border: `1px solid ${T.errBorder}`,
    color: T.errText,
    padding: "10px 14px",
    borderRadius: 9,
    marginBottom: 16,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  cancelBtn: {
    background: "transparent",
    border: `1px solid ${T.border}`,
    color: T.textSec,
    padding: "9px 20px",
    borderRadius: 9,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
  },
  saveBtn: {
    background: T.accent,
    color: "#fff",
    padding: "9px 24px",
    border: "none",
    borderRadius: 9,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
  },
  editActionBtn: {
    background: T.accentSoft,
    color: T.accent,
    border: "1px solid rgba(59,130,246,0.3)",
    padding: "9px 20px",
    borderRadius: 9,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "inherit",
  },

  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
    padding: "14px 16px",
    background: T.surfaceHigh,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
  },
  readGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 20px",
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: T.textMute,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 500,
    color: T.textPri,
  },
  divider: {
    border: "none",
    borderTop: `1px solid ${T.border}`,
    margin: "18px 0",
  },
};

export const MODAL_CSS = `
@keyframes pm-fadeIn  { from { opacity:0 } to { opacity:1 } }
@keyframes pm-slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }

.pm-input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.2) !important;
}
.pm-input::placeholder { color: #3d4f6e; }
.pm-input option { background: #0f1623; color: #e8eeff; }

.pm-close:hover   { background: rgba(255,255,255,0.06) !important; color: #e8eeff !important; }
.pm-cancel:hover  { background: rgba(255,255,255,0.05) !important; color: #e8eeff !important; }
.pm-save:hover:not(:disabled) { background: #2563eb !important; }
.pm-save:disabled { opacity: 0.5; cursor: not-allowed; }
.pm-edit-btn:hover { background: rgba(59,130,246,0.22) !important; }

.pm-modal::-webkit-scrollbar       { width: 5px; }
.pm-modal::-webkit-scrollbar-track { background: transparent; }
.pm-modal::-webkit-scrollbar-thumb { background: #1f2e47; border-radius: 99px; }

.pm-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
`;