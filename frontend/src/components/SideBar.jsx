export const sidebarStyles = {
  sidebar: { width:"220px", height:"100vh", backgroundColor:"#0f172a", padding:"0", position:"fixed", left:0, top:0, display:"flex", flexDirection:"column", borderRight:"1px solid #1e293b", zIndex:100 },
  sidebarBrand: { padding:"20px 20px 16px", borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", gap:"10px" },
  brandIcon: { width:"32px", height:"32px", borderRadius:"8px", background:"#1a56db", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:"700", fontSize:"14px", flexShrink:0 },
  brandName: { color:"#f1f5f9", fontWeight:"600", fontSize:"15px", margin:0, lineHeight:1.2 },
  brandSub: { color:"#64748b", fontSize:"11px", margin:"2px 0 0" },
  navSection: { padding:"16px 12px 8px", flex:1 },
  navLabel: { fontSize:"10px", fontWeight:"600", color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em", padding:"0 8px", marginBottom:"8px", display:"block" },
  navBtn: { display:"flex", alignItems:"center", gap:"10px", width:"100%", padding:"9px 12px", borderRadius:"8px", border:"none", background:"transparent", color:"#94a3b8", fontSize:"13px", fontWeight:"500", cursor:"pointer", textAlign:"left", marginBottom:"2px" },
  navBtnActive: { background:"#1e293b", color:"#e2e8f0" },
  navIcon: { fontSize:"15px", width:"18px", textAlign:"center" },
  sidebarFooter: { padding:"16px 20px", borderTop:"1px solid #1e293b" },
  footerText: { color:"#475569", fontSize:"11px", margin:0, lineHeight:1.5 },
};

export const navItems = [
  { icon:"🏠", label:"Dashboard", path:"/" },
  { icon:"🧾", label:"Bills", path:"/bills" },
  { icon:"👨‍⚕️", label:"Patients", path:"/patients" },
  { icon:"🩺", label:"Doctors", path:"/doctors" },
  { icon:"📅", label:"Appointments", path:"/appointments" },
  { icon:"💊", label:"Treatments", path:"/treatments" },
  { icon:"📊", label:"Reports", path:"/reports" },
];

export const modalStyles = {
  overlay: { position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" },
  modal: { background:"#fff", borderRadius:"14px", width:"480px", maxWidth:"calc(100vw - 32px)", maxHeight:"90vh", overflowY:"auto" },
  header: { padding:"20px 24px 16px", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between" },
  title: { fontSize:"17px", fontWeight:"700", color:"#0f172a" },
  closeBtn: { background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:"20px", lineHeight:1, padding:"2px 6px", borderRadius:"6px" },
  body: { padding:"20px 24px" },
  footer: { padding:"16px 24px", borderTop:"1px solid #e2e8f0", display:"flex", justifyContent:"flex-end", gap:"8px" },
  input: { padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:"8px", fontSize:"13px", color:"#0f172a", fontFamily:"inherit", outline:"none", background:"#fff", width:"100%" },
  label: { fontSize:"11px", fontWeight:"700", color:"#475569", textTransform:"uppercase", letterSpacing:"0.04em" },
  formGroup: { display:"flex", flexDirection:"column", gap:"5px" },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" },
  errBox: { background:"#fef2f2", border:"1px solid #fee2e2", borderRadius:"8px", padding:"10px 14px", color:"#ef4444", fontSize:"13px", marginBottom:"14px" },
  cancelBtn: { background:"#f1f5f9", color:"#475569", border:"none", padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit" },
  saveBtn: { background:"#1a56db", color:"#fff", border:"none", padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit" },
  detailLabel: { fontSize:"11px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"3px" },
  detailValue: { fontSize:"13px", color:"#0f172a", fontWeight:"500" },
};