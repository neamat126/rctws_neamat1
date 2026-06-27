import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgT from "../assets/t.png";
import imgC from "../assets/c.png";
import imgF from "../assets/f.png";
import imgM from "../assets/m.png";
import imgW from "../assets/w.png";
import imgDefault from "../assets/bg1.png";
import API_BASE from "../api";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";

const COURSE_IMAGES = { t: imgT, c: imgC, f: imgF, m: imgM, w: imgW };
const getCourseImage = (code) => {
  const first = code?.trim().toLowerCase()[0];
  return COURSE_IMAGES[first] || imgDefault;
};

export default function Programs() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const nationalId = localStorage.getItem("nationalId");
  const w = useWindowWidth();
  const mobile = isSmall(w);

  useEffect(() => {
    if (!nationalId) { navigate("/"); return; }
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/getData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ national_id: nationalId.trim() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setPrograms(Array.isArray(json) ? json : json.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchPrograms();
  }, [nationalId, navigate]);

  return (
    <div style={{ ...s.container, padding: mobile ? "16px" : "28px 32px" }}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/profile")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          رجوع
        </button>
        <div style={s.headerText}>
          <h2 style={s.title}>البرامج التي تم الحصول عليها</h2>
          <span style={s.countBadge}>{programs.length} برنامج</span>
        </div>
      </div>

      {loading ? (
        <div style={s.center}><div style={s.spinner}/><p style={s.loadingText}>جاري التحميل...</p></div>
      ) : programs.length === 0 ? (
        <div style={s.center}><p style={{ color: "#9AA3AF", fontSize: 14 }}>لا توجد برامج مسجلة</p></div>
      ) : (
        <div style={{ ...s.grid, gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {programs.map((prog, i) => {
            const name = prog.course_Name || prog.course_name || "—";
            const code = prog.course_ID   || prog.course_id   || "—";
            const img  = getCourseImage(code);
            return (
              <div key={i} style={s.card}>
                <div style={s.cardImg}>
                  <img src={img} alt={name} style={s.img} />
                  {code !== "—" && <span style={s.codeBadge}>{code}</span>}
                </div>
                <div style={s.cardBody}>
                  <p style={s.cardName}>{name}</p>
                  <div style={s.cardFooter}>
                    <span style={s.stars}>&#9733;&#9733;&#9733;&#9733;</span>
                    <span style={s.doneBadge}>مكتمل</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  container: { minHeight: "100vh", backgroundColor: "#f4f6fa", direction: "rtl", padding: "28px 32px", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  backBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "#fff", border: "1px solid #E8ECF2", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#0C447C", fontWeight: "600" },
  headerText: { display: "flex", alignItems: "center", gap: "12px" },
  title: { fontSize: "18px", fontWeight: "700", color: "#0D2137", margin: 0 },
  countBadge: { backgroundColor: "#EEF2FF", color: "#4338CA", fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", border: "1px solid #C7D2FE" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
  card: { backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden", border: "1px solid #E8ECF2", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" },
  cardImg: { position: "relative", width: "100%", height: "130px", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  codeBadge: { position: "absolute", bottom: "6px", left: "6px", backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "5px" },
  cardBody: { padding: "12px" },
  cardName: { fontSize: "13px", fontWeight: "600", color: "#1A2535", margin: "0 0 8px", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textAlign: "right" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  stars: { fontSize: "12px", color: "#F59E0B" },
  doneBadge: { fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "8px", backgroundColor: "#E6F4EE", color: "#0F5132" },
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: 12 },
  spinner: { width: 32, height: 32, border: "3px solid #E3E8EF", borderTop: "3px solid #0C447C", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#0C447C", fontWeight: 600 },
};
