import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";

export default function Messages() {
  const navigate  = useNavigate();
  const w         = useWindowWidth();
  const mobile    = isSmall(w);
  const empname   = localStorage.getItem("empname") || "";
  const levelname = localStorage.getItem("Levelname") || "";
  const sidebarW  = mobile ? "0px" : "260px";

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6fa", direction: "rtl" }}>
      <Sidebar empname={empname} levelname={levelname} onLogout={handleLogout} />

      <div style={{ flex: 1, marginRight: sidebarW, display: "flex", alignItems: "center", justifyContent: "center", padding: mobile ? "56px 16px 32px" : "24px", fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif" }}>
        <div style={s.card}>
          <div style={s.iconWrap}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B4F7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <h2 style={s.title}>الرسائل</h2>
          <p style={s.sub}>هذه الصفحة قيد التطوير</p>
          <p style={s.desc}>سيتم إضافة نظام الرسائل قريباً</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { backgroundColor: "#fff", borderRadius: 20, padding: "3rem 2.5rem", textAlign: "center", boxShadow: "0 4px 24px rgba(27,79,122,.08)", border: "1px solid #E8ECF2", maxWidth: 380, width: "90%" },
  iconWrap: { width: 88, height: 88, borderRadius: "50%", backgroundColor: "#EBF3FA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" },
  title: { fontSize: 22, fontWeight: 700, color: "#1A2332", margin: "0 0 8px" },
  sub:   { fontSize: 14, color: "#1B4F7A", fontWeight: 600, margin: "0 0 8px" },
  desc:  { fontSize: 13, color: "#9AA3AF", margin: "0 0 2rem", lineHeight: 1.7 },
};

