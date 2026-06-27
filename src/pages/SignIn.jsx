import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import avatar2 from "../assets/avatar2.png";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";

export default function SignIn() {
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const w = useWindowWidth();
  const mobile = isSmall(w);

  const handleLogin = async () => {
    if (!nationalId || !password) { setError("من فضلك ادخل الرقم القومي وكلمة السر"); return; }
    setLoading(true); setError("");
    try {
      const userRef  = ref(db, `mmm/${nationalId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        let stored = snapshot.val();
        if (typeof stored === "string") stored = stored.replace(/^["']+|["']+$/g, "");
        const part = stored.split("-").pop() || stored;
        if (stored === password || part === password) {
          localStorage.setItem("nationalId", nationalId);
          navigate("/profile");
        } else { setError("كلمة السر غلط"); }
      } else { setError("الرقم القومي مش موجود، سجل أولاً"); }
    } catch (e) { setError("حصل خطأ: " + e.message); }
    setLoading(false);
  };

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <header style={s.header}>
        <div style={{ ...s.headerInner, padding: mobile ? ".75rem 1rem" : "1rem 2.5rem" }}>
          <div style={s.logosRow}>
            <img src={logo1} alt="logo1" style={{ ...s.logo, height: mobile ? "36px" : "60px" }} />
            <div style={s.vline} />
            <img src={logo2} alt="logo2" style={{ ...s.logo, height: mobile ? "36px" : "60px" }} />
            {!mobile && <><div style={s.vline} /><img src={logo3} alt="logo3" style={s.logo} /></>}
          </div>
          <div style={s.titleBlock}>
            <span style={{ ...s.titleAr, fontSize: mobile ? 12 : 17 }}>وزارة الموارد المائية والري</span>
            {!mobile && <span style={s.titleEn}>Ministry of Water Resources & Irrigation</span>}
            {!mobile && <span style={s.titleEn}>Promotion system</span>}
          </div>
        </div>
        <div style={s.headerBar} />
      </header>

      {/* ── Page body ── */}
      <main style={{ ...s.main, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "center" : "stretch" }}>

        {/* الـ illustration — على الموبايل تظهر فوق الكارد، على الديسكتوب في اللفت بانيل */}
        {mobile ? (
          /* Mobile: صورة صغيرة فوق الكارد مع خلفية زرقاء */
          <div style={s.mobileHero}>
            <div style={s.mobileHeroInner}>
              <div style={s.mobileRing1} />
              <div style={s.mobileRing2} />
              <div style={s.mobileBorder}>
                <img src={avatar2} alt="illustration" style={s.mobileImg} />
              </div>
            </div>
            <h2 style={s.mobilePanelTitle}>اللائحة التدريبية للعاملين</h2>
            <p style={s.mobilePanelSub}>MWRI Promotion System</p>
          </div>
        ) : (
          /* Desktop: اللفت بانيل الكامل */
          <div style={s.leftPanel}>
            <div style={s.leftContent}>
              <div style={s.illustWrap}>
                <div style={s.illustRing1} />
                <div style={s.illustRing2} />
                <div style={s.illustBorder}>
                  <img src={avatar2} alt="illustration" style={s.illustImg} />
                </div>
                <div style={s.illustBadge}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 style={s.panelTitle}>اللائحة التدريبية للعاملين <br/>بوزارة الموارد المائية و الري</h2>
              <p style={s.panelSub}>MWRI Promotion System</p>
              <div style={s.dividerLine} />
              <p style={s.panelDesc}>
                منصة رقمية متكاملة لمتابعة مسار البرامج اللائحة التدريبية<br/>
                وإدارة البرامج التدريبية الإلزامية
              </p>
              <div style={s.featureList}>
                {["متابعة طلبات البرامج اللائحة التدريبية", "البرامج التدريبية الإلزامية", "الملف الوظيفي الرقمي"].map((f, i) => (
                  <div key={i} style={s.featureItem}>
                    <span style={s.featureDot} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── الكارد — نفس التصميم على الموبايل والديسكتوب ── */}
        <div style={{ ...s.rightPanel, padding: mobile ? "1rem" : "2.5rem", width: mobile ? "100%" : "auto" }}>
          <div style={{ ...s.card, maxWidth: mobile ? "100%" : 420, boxShadow: mobile ? "0 2px 16px rgba(27,79,122,.1)" : "0 4px 24px rgba(27,79,122,.08)" }}>
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#1B4F7A" strokeWidth="1.5"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#1B4F7A" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={s.cardTitle}>تسجيل الدخول</h3>
              <p style={s.cardSub}>أدخل بياناتك للوصول إلى حسابك</p>
            </div>

            <div style={s.formBody}>
              {/* National ID */}
              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>الرقم القومي</label>
                <div style={s.inputWrap}>
                  <svg style={s.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#9AA0A8" strokeWidth="1.5"/>
                    <path d="M2 10h20M7 15h2M11 15h2" stroke="#9AA0A8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    style={s.input}
                    placeholder="أدخل الرقم القومي (14 رقم)"
                    value={nationalId}
                    onChange={e => setNationalId(e.target.value)}
                    dir="rtl"
                    maxLength={14}
                    inputMode="numeric"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>كلمة المرور</label>
                <div style={s.inputWrap}>
                  <svg style={s.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9AA0A8" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9AA0A8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    style={{ ...s.input, flex: 1 }}
                    type={showPass ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button style={s.eyeBtn} onClick={() => setShowPass(!showPass)} type="button">
                    {showPass
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA0A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA0A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div style={s.errorBox}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{error}</span>
                </div>
              )}

              <button style={{ ...s.submitBtn, opacity: loading ? .7 : 1 }} onClick={handleLogin} disabled={loading}>
                {loading ? <><span style={s.spinner} /> جارٍ التحقق...</> : "دخول"}
              </button>

              <div style={s.switchRow}>
                <span style={s.switchText}>ليس لديك حساب؟</span>
                <button style={s.switchLink} onClick={() => navigate("/signup")}>إنشاء حساب جديد</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <span>جميع الحقوق محفوظة © {new Date().getFullYear()} — وزارة الموارد المائية والري</span>
      </footer>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif", direction: "rtl", background: "#F4F5F7" },

  /* Header */
  header: { background: "#fff", borderBottom: "1px solid #DDE1E7" },
  headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem" },
  logosRow: { display: "flex", alignItems: "center", gap: "1rem" },
  logo: { height: "60px", objectFit: "contain" },
  vline: { width: 1, height: 44, background: "#DDE1E7" },
  titleBlock: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 },
  titleAr: { fontSize: 17, fontWeight: 600, color: "#1B4F7A" },
  titleEn: { fontSize: 12, color: "#9AA0A8", letterSpacing: ".3px" },
  headerBar: { height: 4, background: "linear-gradient(90deg, #1B4F7A 0%, #2468A0 60%, #D9632A 100%)" },

  /* Main */
  main: { flex: 1, display: "flex" },

  /* Mobile hero strip */
  mobileHero: {
    width: "100%",
    background: "linear-gradient(160deg, #1B4F7A 0%, #1a3f6a 100%)",
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "1.5rem 1rem 1rem",
    gap: "0.5rem",
  },
  mobileHeroInner: {
    position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
    width: 110, height: 110, marginBottom: "0.5rem",
  },
  mobileRing1: {
    position: "absolute", width: 100, height: 100, borderRadius: "50%",
    border: "1.5px dashed rgba(255,255,255,.45)",
    animation: "spinRingS 20s linear infinite",
  },
  mobileRing2: {
    position: "absolute", width: 118, height: 118, borderRadius: "50%",
    border: "1.5px solid rgba(255,176,116,.5)",
    animation: "spinRingRS 28s linear infinite",
  },
  mobileBorder: {
    width: 80, height: 80, borderRadius: "50%", padding: 3,
    background: "linear-gradient(135deg, #FFB074 0%, #fff 50%, #D9632A 100%)",
    position: "relative", zIndex: 1, flexShrink: 0,
  },
  mobileImg: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" },
  mobilePanelTitle: { fontSize: 15, fontWeight: 600, color: "#fff", textAlign: "center", margin: 0 },
  mobilePanelSub: { fontSize: 11, color: "rgba(255,255,255,.5)", margin: 0 },

  /* Desktop left panel */
  leftPanel: { width: "42%", background: "linear-gradient(160deg, #1B4F7A 0%, #1a3f6a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2.5rem", position: "relative", overflow: "hidden" },
  leftContent: { position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem" },
  illustWrap: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: ".5rem", animation: "fadeUp .6s .3s both" },
  illustRing1: { position: "absolute", width: 170, height: 170, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,.45)", animation: "spinRingS 20s linear infinite" },
  illustRing2: { position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1.5px solid rgba(255,176,116,.5)", animation: "spinRingRS 28s linear infinite" },
  illustBorder: { width: 130, height: 130, borderRadius: "50%", padding: 3, background: "linear-gradient(135deg, #FFB074 0%, #fff 50%, #D9632A 100%)", animation: "glowPulseS 3s ease-in-out infinite", position: "relative", zIndex: 1, flexShrink: 0 },
  illustImg: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" },
  illustBadge: { position: "absolute", bottom: 6, left: "calc(50% + 38px)", width: 24, height: 24, borderRadius: "50%", background: "#27ae60", border: "2px solid #1a3f6a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 2px 6px rgba(39,174,96,.5)" },
  panelTitle: { fontSize: 22, fontWeight: 600, color: "#fff", textAlign: "right", margin: 0 },
  panelSub: { fontSize: 13, color: "rgba(255,255,255,.5)", letterSpacing: ".5px", margin: 0 },
  dividerLine: { width: "100%", height: 1, background: "rgba(255,255,255,.15)" },
  panelDesc: { fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 2, textAlign: "right", margin: 0 },
  featureList: { display: "flex", flexDirection: "column", gap: 10, alignSelf: "stretch" },
  featureItem: { display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end", fontSize: 13, color: "rgba(255,255,255,.75)" },
  featureDot: { width: 6, height: 6, borderRadius: "50%", background: "#FFB074", flexShrink: 0 },

  /* Card */
  rightPanel: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem" },
  card: { width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, border: "1px solid #DDE1E7", boxShadow: "0 4px 24px rgba(27,79,122,.08)", overflow: "hidden" },
  cardHeader: { background: "#EBF3FA", padding: "1.75rem 2rem 1.5rem", textAlign: "center", borderBottom: "1px solid #DDE1E7" },
  cardIcon: { width: 52, height: 52, borderRadius: 13, background: "#fff", border: "1px solid #DDE1E7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto .75rem" },
  cardTitle: { fontSize: 18, fontWeight: 600, color: "#1A2332", margin: "0 0 4px" },
  cardSub: { fontSize: 12, color: "#9AA0A8", margin: 0 },
  formBody: { padding: "1.75rem 2rem" },
  fieldGroup: { marginBottom: "1.1rem" },
  fieldLabel: { display: "block", fontSize: 12, color: "#9AA0A8", marginBottom: 6, fontWeight: 500 },
  inputWrap: { display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #DDE1E7", borderRadius: 9, padding: "10px 12px", background: "#F4F5F7", transition: ".2s" },
  inputIcon: { flexShrink: 0 },
  input: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1A2332", fontFamily: "inherit", direction: "rtl" },
  eyeBtn: { background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" },
  errorBox: { display: "flex", alignItems: "center", gap: 6, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "9px 12px", marginBottom: "1rem", fontSize: 12, color: "#c0392b", direction: "rtl" },
  submitBtn: { width: "100%", padding: "12px", background: "#1B4F7A", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: ".2s", marginBottom: "1rem" },
  spinner: { width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" },
  switchRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
  switchText: { fontSize: 12, color: "#9AA0A8" },
  switchLink: { fontSize: 12, color: "#2468A0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, padding: 0 },
  footer: { background: "#fff", borderTop: "1px solid #DDE1E7", padding: ".75rem 2rem", textAlign: "center", fontSize: 11, color: "#9AA0A8" },
};
