import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";

export default function Guide() {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/profile")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          رجوع
        </button>

        <div style={s.headerCenter}>
          <div style={s.logos}>
            <img src={logo2} alt="logo2" style={s.logo}/>
            <img src={logo1} alt="logo1" style={s.logo}/>
            <img src={logo3} alt="logo3" style={s.logo}/>
          </div>
          <h1 style={s.title}>كتيب اللائحة التدريبية</h1>
          <p style={s.sub}>مركز التدريب الإقليمي للموارد المائية والري</p>
        </div>

        <div style={{ width: "80px" }}/>
      </div>

      {/* PDF Viewer */}
      <div style={s.viewerWrap}>
        <iframe
          src="/trainig_programs.pdf"
          style={s.iframe}
          title="كتيب اللائحة التدريبية"
        />
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#1a1a2e",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
    direction: "rtl",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    background: "linear-gradient(135deg, #041d52, #0C447C)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
    gap: "16px",
    flexWrap: "wrap",
  },
  backBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "8px 14px", backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px",
    cursor: "pointer", fontSize: "13px", color: "#fff", fontWeight: "600",
    fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
  },
  headerCenter: { flex: 1, textAlign: "center" },
  logos: { display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "8px" },
  logo: { height: "36px", objectFit: "contain" },
  title: { fontSize: "18px", fontWeight: "700", color: "#fff", margin: "0 0 4px" },
  sub: { fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 },
  downloadBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "8px 16px", backgroundColor: "#378ADD",
    border: "none", borderRadius: "8px",
    cursor: "pointer", fontSize: "13px", color: "#fff", fontWeight: "600",
    textDecoration: "none",
  },
  viewerWrap: {
    flex: 1,
    padding: "0",
    display: "flex",
    flexDirection: "column",
  },
  iframe: {
    flex: 1,
    width: "100%",
    height: "calc(100vh - 90px)",
    border: "none",
    display: "block",
  },
};
