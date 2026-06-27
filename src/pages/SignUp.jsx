import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, set, get } from "firebase/database";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import avatar  from "../assets/avatar.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.jpg";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";

export default function SignUp() {
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const w = useWindowWidth();
  const mobile = isSmall(w);

  const handleSignUp = async () => {
    if (!nationalId || !password) { setError("من فضلك ادخل الرقم القومي وكلمة السر"); return; }
    setLoading(true); setError("");
    try {
      const userRef  = ref(db, `mmm/${nationalId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) { setError("الرقم القومي ده مسجل قبل كده"); setLoading(false); return; }
      await set(userRef, `${nationalId}-${password}`);
      localStorage.setItem("nationalId", nationalId);
      navigate("/profile");
    } catch (e) { setError("حصل خطأ: " + e.message); }
    setLoading(false);
  };

  return (
    <div style={s.page}>

      <header style={s.header}>
        <div style={{ ...s.headerInner, padding: mobile ? ".75rem 1rem" : "1rem 2.5rem" }}>
          <div style={s.logosRow}>
            <img src={logo1} alt="logo1" style={{ ...s.logo, height: mobile ? "36px" : "60px" }} />
            <div style={s.vline} />
            <img src={logo2} alt="logo2" style={{ ...s.logo, height: mobile ? "36px" : "60px" }} />
            {!mobile && <><div style={s.vline} /><img src={logo3} alt="logo3" style={s.logo} /></>}
          </div>
          <div style={s.titleBlock}>
            <span style={{ ...s.titleAr, fontSize: mobile ? 13 : 17 }}>وزارة الموارد المائية والري</span>
            {!mobile && <span style={s.titleEn}>Ministry of Water Resources & Irrigation</span>}
          </div>
        </div>
        <div style={s.headerBar} />
      </header>

      <main style={{ ...s.main, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "center" : "stretch" }}>

        {mobile ? (
          /* Mobile hero — الصور الثلاث مع خلفية زرقاء */
          <div style={s.mobileHero}>
            <div style={s.mobileAvatarsRow}>
              <img src={avatar3} alt="u" style={{...s.mobileAv, zIndex:1, animation:"floatAvatar 4s .6s ease-in-out infinite"}} />
              <img src={avatar2} alt="u" style={{...s.mobileAv, zIndex:2, marginRight:-20, animation:"floatAvatar 4s .3s ease-in-out infinite"}} />
              <img src={avatar}  alt="u" style={{...s.mobileAv, zIndex:3, marginRight:-20, animation:"floatAvatar 4s 0s ease-in-out infinite"}} />
              <div style={s.mobileAvCount}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,.7)" strokeWidth="1.5"/>
                  <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M19 4v6M16 7h6" stroke="#FFB074" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <p style={s.mobileAvCaption}>موظف مسجّل في المنصة</p>
            <h2 style={s.mobilePanelTitle}>انضم إلى منصة اللائحة التدريبية</h2>
            <p style={s.mobilePanelSub}>MWRI Promotion System</p>
          </div>
        ) : (
          /* Desktop left panel */
        <div style={s.leftPanel}>
          <div style={s.leftContent}>

            <div style={s.avatarsRow}>
              <img src={avatar3} alt="u" style={{...s.av, zIndex:1, animation:"floatAvatar 4s .6s ease-in-out infinite"}} />
              <img src={avatar2} alt="u" style={{...s.av, zIndex:2, marginRight:-24, animation:"floatAvatar 4s .3s ease-in-out infinite"}} />
              <img src={avatar}  alt="u" style={{...s.av, zIndex:3, marginRight:-24, animation:"floatAvatar 4s 0s ease-in-out infinite"}} />
              <div style={s.avCount}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,.7)" strokeWidth="1.5"/>
                  <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M19 4v6M16 7h6" stroke="#FFB074" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <p style={s.avCaption}>موظف مسجّل في المنصة</p>

            <h2 style={s.panelTitle}>انضم إلى منصة اللائحة التدريبية</h2>
            <p style={s.panelSub}>MWRI Promotion System</p>
            <div style={s.dividerLine} />
            <p style={s.panelDesc}>سجّل ببياناتك الوظيفية وابدأ<br/>متابعة مسار ترقيتك فوراً</p>

            <div style={s.stepsBlock}>
              {[{n:"١",t:"أدخل رقمك القومي"},{n:"٢",t:"اختر كلمة مرور"},{n:"٣",t:"ابدأ استخدام المنصة"}].map(step => (
                <div key={step.n} style={s.stepItem}>
                  <span style={s.stepNum}>{step.n}</span>
                  <span style={s.stepText}>{step.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        <div style={{ ...s.rightPanel, padding: mobile ? "1rem" : "2.5rem", width: mobile ? "100%" : "auto" }}>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#D9632A" strokeWidth="1.5"/>
                  <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#D9632A" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M19 4v6M16 7h6" stroke="#D9632A" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={s.cardTitle}>إنشاء حساب</h3>
              <p style={s.cardSub}>أدخل بياناتك الوظيفية للتسجيل في المنصة</p>
            </div>

            <div style={s.formBody}>
              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>الرقم القومي</label>
                <div style={s.inputWrap}>
                  <svg style={s.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#9AA0A8" strokeWidth="1.5"/>
                    <path d="M2 10h20M7 15h2M11 15h2" stroke="#9AA0A8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input style={s.input} placeholder="أدخل الرقم القومي (14 رقم)"
                    value={nationalId} onChange={e => setNationalId(e.target.value)}
                    dir="rtl" maxLength={14} />
                </div>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>كلمة المرور</label>
                <div style={s.inputWrap}>
                  <svg style={s.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9AA0A8" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9AA0A8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input style={s.input} type="password" placeholder="اختر كلمة مرور قوية"
                    value={password} onChange={e => setPassword(e.target.value)} dir="rtl" />
                </div>
                <p style={s.fieldHint}>يُنصح باستخدام أرقام وحروف معاً</p>
              </div>

              {error && (
                <div style={s.errorBox}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button style={{...s.submitBtn, opacity: loading ? .7 : 1}} onClick={handleSignUp} disabled={loading}>
                {loading ? <><span style={s.spinner}/> جارٍ التسجيل...</> : "إنشاء الحساب"}
              </button>

              <div style={s.switchRow}>
                <span style={s.switchText}>لديك حساب بالفعل؟</span>
                <button style={s.switchLink} onClick={() => navigate("/signin")}>تسجيل الدخول</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={s.footer}>
        <span>جميع الحقوق محفوظة © {new Date().getFullYear()} — وزارة الموارد المائية والري</span>
      </footer>
    </div>
  );
}

const s = {
  page:        { minHeight:"100vh", display:"flex", flexDirection:"column", fontFamily:"'IBM Plex Sans Arabic','Segoe UI',sans-serif", direction:"rtl", background:"#F4F5F7" },
  header:      { background:"#fff", borderBottom:"1px solid #DDE1E7" },
  headerInner: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1rem 2.5rem" },
  logosRow:    { display:"flex", alignItems:"center", gap:"1rem" },
  logo:        { height:"60px", objectFit:"contain" },
  vline:       { width:1, height:44, background:"#DDE1E7" },
  titleBlock:  { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 },
  titleAr:     { fontSize:17, fontWeight:600, color:"#1B4F7A" },
  titleEn:     { fontSize:12, color:"#9AA0A8", letterSpacing:".3px" },
  headerBar:   { height:4, background:"linear-gradient(90deg,#1B4F7A 0%,#2468A0 60%,#D9632A 100%)" },
  main:        { flex:1, display:"flex", alignItems:"stretch" },
  leftPanel:   { width:"42%", background:"linear-gradient(160deg,#1B4F7A 0%,#1a3f6a 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 2.5rem" },
  leftContent: { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"1.1rem" },
  avatarsRow:  { display:"flex", alignItems:"center", flexDirection:"row-reverse" },
  av:          { width:80, height:80, borderRadius:"50%", objectFit:"cover", border:"3px solid rgba(255,255,255,.3)", boxShadow:"0 4px 16px rgba(0,0,0,.3)" },
  avCount:     { width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.12)", border:"3px solid rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#fff", fontWeight:600, marginRight:-24, zIndex:0 },
  avCaption:   { fontSize:12, color:"rgba(255,255,255,.5)", margin:0, textAlign:"right" },
  panelTitle:  { fontSize:22, fontWeight:600, color:"#fff", textAlign:"right", margin:0 },
  panelSub:    { fontSize:13, color:"rgba(255,255,255,.5)", letterSpacing:".5px", margin:0 },
  dividerLine: { width:"100%", height:1, background:"rgba(255,255,255,.15)" },
  panelDesc:   { fontSize:13, color:"rgba(255,255,255,.6)", lineHeight:2, textAlign:"right", margin:0 },
  stepsBlock:  { display:"flex", flexDirection:"column", gap:12, alignSelf:"stretch" },
  stepItem:    { display:"flex", alignItems:"center", gap:12, justifyContent:"flex-end" },
  stepNum:     { width:26, height:26, borderRadius:"50%", background:"rgba(255,176,116,.2)", border:"1px solid rgba(255,176,116,.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#FFB074", flexShrink:0 },
  stepText:    { fontSize:13, color:"rgba(255,255,255,.75)" },
  rightPanel:  { flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2.5rem" },
  card:        { width:"100%", maxWidth:420, background:"#fff", borderRadius:16, border:"1px solid #DDE1E7", boxShadow:"0 4px 24px rgba(27,79,122,.08)", overflow:"hidden" },
  cardHeader:  { background:"#FDF0EA", padding:"1.75rem 2rem 1.5rem", textAlign:"center", borderBottom:"1px solid #DDE1E7" },
  cardIcon:    { width:52, height:52, borderRadius:13, background:"#fff", border:"1px solid #DDE1E7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto .75rem" },
  cardTitle:   { fontSize:18, fontWeight:600, color:"#1A2332", margin:"0 0 4px" },
  cardSub:     { fontSize:12, color:"#9AA0A8", margin:0 },
  formBody:    { padding:"1.75rem 2rem" },
  fieldGroup:  { marginBottom:"1.1rem" },
  fieldLabel:  { display:"block", fontSize:12, color:"#9AA0A8", marginBottom:6, fontWeight:500 },
  fieldHint:   { fontSize:11, color:"#9AA0A8", marginTop:5 },
  inputWrap:   { display:"flex", alignItems:"center", gap:8, border:"1.5px solid #DDE1E7", borderRadius:9, padding:"10px 12px", background:"#F4F5F7" },
  inputIcon:   { flexShrink:0 },
  input:       { flex:1, border:"none", outline:"none", background:"transparent", fontSize:13, color:"#1A2332", fontFamily:"inherit", direction:"rtl" },
  errorBox:    { display:"flex", alignItems:"center", gap:6, background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"9px 12px", marginBottom:"1rem", fontSize:12, color:"#c0392b", direction:"rtl" },
  submitBtn:   { width:"100%", padding:"12px", background:"#D9632A", color:"#fff", border:"none", borderRadius:9, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:".2s", marginBottom:"1rem" },
  spinner:     { width:14, height:14, border:"2px solid rgba(255,255,255,.3)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" },
  switchRow:   { display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  switchText:  { fontSize:12, color:"#9AA0A8" },
  switchLink:  { fontSize:12, color:"#2468A0", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:600, padding:0 },
  footer:      { background:"#fff", borderTop:"1px solid #DDE1E7", padding:".75rem 2rem", textAlign:"center", fontSize:11, color:"#9AA0A8" },

  // Mobile hero
  mobileHero: {
    width: "100%",
    background: "linear-gradient(160deg, #1B4F7A 0%, #1a3f6a 100%)",
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "1.5rem 1rem 1rem",
    gap: "0.4rem",
  },
  mobileAvatarsRow: {
    display: "flex", alignItems: "center", flexDirection: "row-reverse",
    marginBottom: "0.3rem",
  },
  mobileAv: {
    width: 60, height: 60, borderRadius: "50%", objectFit: "cover",
    border: "3px solid rgba(255,255,255,.3)",
    boxShadow: "0 4px 16px rgba(0,0,0,.3)",
  },
  mobileAvCount: {
    width: 60, height: 60, borderRadius: "50%",
    background: "rgba(255,255,255,.12)",
    border: "3px solid rgba(255,255,255,.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginRight: -20, zIndex: 0,
  },
  mobileAvCaption: { fontSize: 11, color: "rgba(255,255,255,.5)", margin: 0 },
  mobilePanelTitle: { fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "center", margin: 0, lineHeight: 1.5, padding: "0 0.5rem" },
  mobilePanelSub: { fontSize: 11, color: "rgba(255,255,255,.5)", margin: 0 },
};
