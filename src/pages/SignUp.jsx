import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, set, get } from "firebase/database";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import avatar3 from "../assets/avatar3.jpg";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";
import { gsap } from "gsap";

export default function SignUp() {
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const w      = useWindowWidth();
  const mobile = isSmall(w);

  const cardRef = useRef(null);
  const leftRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 40, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.2 }
    );
    if (leftRef.current) {
      gsap.fromTo(leftRef.current.querySelectorAll(".anim-text"),
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.1, delay: 0.3 }
      );
    }
  }, []);

  const animBtn = (e) => gsap.fromTo(e.currentTarget,
    { scale: 0.93 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }
  );

  const handleSignUp = async () => {
    if (!nationalId || !password) { setError("من فضلك ادخل الرقم القومي وكلمة السر"); return; }
    setLoading(true); setError("");
    try {
      const userRef  = ref(db, `mmm/${nationalId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) { setError("الرقم القومي مسجل من قبل"); setLoading(false); return; }
      await set(userRef, `${nationalId}-${password}`);
      localStorage.setItem("nationalId", nationalId);
      navigate("/profile");
    } catch (e) { setError("حصل خطأ: " + e.message); }
    setLoading(false);
  };

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <header style={s.header}>
        <div style={{ ...s.headerInner, padding: mobile ? ".75rem 1rem" : "1rem 2.5rem" }}>
          <div style={{ ...s.logosRow, cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src={logo2} alt="logo2" style={{ ...s.logo, height: mobile ? "36px" : "52px" }} />
            <div style={s.vline} />
            <img src={logo1} alt="logo1" style={{ ...s.logo, height: mobile ? "36px" : "52px" }} />
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

        {mobile ? (
          <div style={s.mobileHero}>
            <div style={s.mobileHeroInner}>
              <div style={s.mobileRing1} />
              <div style={s.mobileRing2} />
              <div style={s.mobileBorder}>
                <img src={avatar3} alt="illustration" style={s.mobileImg} />
              </div>
            </div>
            <h2 style={s.mobilePanelTitle}>انضم إلى منصة اللائحة التدريبية</h2>
            <p style={s.mobilePanelSub}>MWRI Promotion System</p>
          </div>
        ) : (
          <div style={s.leftPanel}>
            <div style={s.leftContent} ref={leftRef}>

              {/* Illustration كبير */}
              <div style={s.illustWrap}>
                <div style={s.illustRing1} />
                <div style={s.illustRing2} />
                <div style={s.illustBorder}>
                  <img src={avatar3} alt="illustration" style={s.illustImg} />
                </div>
                <div style={s.illustBadge}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* سلم النصوص */}
              <div style={s.textLadder}>
                <p className="anim-text" style={s.ladder0}>MWRI Promotion System</p>
                <p className="anim-text" style={s.ladder1}>منصة اللائحة التدريبية</p>
                <h2 className="anim-text" style={s.ladder2}>انضم إلى منصة اللائحة التدريبية
</h2>
                <div className="anim-text" style={s.ladderLine} />
                <div style={s.featureList}>
                  {[
                    { n:"١", t:"أدخل رقمك القومي",   delay:"0s"   },
                    { n:"٢", t:"اختر كلمة مرور",      delay:".12s" },
                    { n:"٣", t:"ابدأ استخدام المنصة", delay:".24s" },
                  ].map((f,i) => (
                    <div key={i} className="anim-text" style={{ ...s.featureItem, animationDelay: f.delay }}>
                      <span style={s.featureNum}>{f.n}</span>
                      <span>{f.t}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── الكارد ── */}
        <div style={{ ...s.rightPanel, padding: mobile ? "1rem" : "1.5rem 2.5rem", width: mobile ? "100%" : "auto" }}>
          <div ref={cardRef} style={{ ...s.card, maxWidth: mobile ? "100%" : 400, boxShadow: mobile ? "0 2px 16px rgba(232,98,10,.1)" : "0 4px 24px rgba(232,98,10,.08)" }}>
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#E8620A" strokeWidth="1.5"/>
                  <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#E8620A" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M19 4v6M16 7h6" stroke="#E8620A" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={s.cardTitle}>إنشاء حساب جديد</h3>
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
                    dir="rtl" maxLength={14} inputMode="numeric" />
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
                {/* Password strength indicator */}
                {password.length > 0 && (() => {
                  const hasLetters = /[a-zA-Z\u0600-\u06FF]/.test(password);
                  const hasNumbers = /[0-9]/.test(password);
                  const mixed = hasLetters && hasNumbers;
                  const color = mixed ? "#E8620A" : "#e74c3c";
                  const label = mixed ? "متوسطة — أضف رموزاً لتقويتها" : "ضعيفة — أرقام فقط";
                  const width  = mixed ? "60%" : "30%";
                  return (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ height: 3, borderRadius: 2, background: "#DDE1E7", overflow: "hidden" }}>
                        <div style={{ height: "100%", width, background: color, borderRadius: 2, transition: "width .4s, background .4s" }} />
                      </div>
                      <p style={{ fontSize: 10, color, margin: "3px 0 0", textAlign: "right" }}>{label}</p>
                    </div>
                  );
                })()}
              </div>

              {error && (
                <div style={s.errorBox}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button style={{ ...s.submitBtn, opacity: loading ? .7 : 1 }}
                onClick={(e) => { animBtn(e); handleSignUp(); }} disabled={loading}>
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

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <span>جميع الحقوق محفوظة © {new Date().getFullYear()} — وزارة الموارد المائية والري</span>
      </footer>
    </div>
  );
}

const s = {
  page: { height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif", direction: "rtl", background: "#F4F5F7", overflow: "hidden" },

  /* Header */
  header: { background: "#fff", borderBottom: "1px solid #DDE1E7", flexShrink: 0 },
  headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem" },
  logosRow: { display: "flex", alignItems: "center", gap: "1rem" },
  logo: { height: "52px", objectFit: "contain" },
  vline: { width: 1, height: 38, background: "#DDE1E7" },
  titleBlock: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 },
  titleAr: { fontSize: 17, fontWeight: 600, color: "#1B4F7A" },
  titleEn: { fontSize: 12, color: "#9AA0A8", letterSpacing: ".3px" },
  headerBar: { height: 3, background: "linear-gradient(90deg, #1B4F7A 0%, #2468A0 60%, #E8620A 100%)" },

  /* Main */
  main: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },

  /* Mobile */
  mobileHero: { width: "100%", background: "linear-gradient(160deg, #1B4F7A 0%, #1a3f6a 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", gap: "0.4rem" },
  mobileHeroInner: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 90, height: 90, marginBottom: "0.3rem" },
  mobileRing1: { position: "absolute", width: 84, height: 84, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,.45)", animation: "spinRingS 20s linear infinite" },
  mobileRing2: { position: "absolute", width: 100, height: 100, borderRadius: "50%", border: "1.5px solid rgba(232,98,10,.5)", animation: "spinRingRS 28s linear infinite" },
  mobileBorder: { width: 66, height: 66, borderRadius: "50%", padding: 3, background: "linear-gradient(135deg, #E8620A 0%, #fff 50%, #E8620A 100%)", position: "relative", zIndex: 1, flexShrink: 0 },
  mobileImg: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" },
  mobilePanelTitle: { fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "center", margin: 0 },
  mobilePanelSub: { fontSize: 10, color: "rgba(255,255,255,.5)", margin: 0 },

  /* Desktop left panel */
  leftPanel: { width: "42%", background: "linear-gradient(160deg, #1B4F7A 0%, #1a3f6a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 2.5rem", position: "relative", overflow: "hidden", flexShrink: 0 },
  leftContent: { position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: ".75rem", width: "100%" },
  illustWrap: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: ".5rem", animation: "fadeUp .6s .3s both" },
  illustRing1: { position: "absolute", width: 264, height: 264, borderRadius: "50%", border: "1.5px dashed rgba(232,98,10,.55)", animation: "spinRingS 20s linear infinite" },
  illustRing2: { position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1.5px solid rgba(232,98,10,.35)", animation: "spinRingRS 28s linear infinite" },
  illustBorder: { width: 220, height: 220, borderRadius: "50%", padding: 4, background: "linear-gradient(135deg, #E8620A 0%, #fff 50%, #E8620A 100%)", animation: "glowPulseS 3s ease-in-out infinite", position: "relative", zIndex: 1, flexShrink: 0 },
  illustImg: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" },
  illustBadge: { position: "absolute", bottom: 10, left: "calc(50% + 64px)", width: 26, height: 26, borderRadius: "50%", background: "#E8620A", border: "2px solid #1a3f6a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 2px 6px rgba(232,98,10,.5)" },

  /* سلم النصوص */
  textLadder: { display: "flex", flexDirection: "column", alignItems: "center", gap: ".3rem", width: "100%", textAlign: "center" },
  ladder0: { fontSize: 11, color: "rgba(255,255,255,.4)", letterSpacing: "1.5px", margin: 0 },
  ladder1: { fontSize: 16, color: "rgba(255,255,255,.7)", margin: 0, fontWeight: 400 },
  ladder2: { fontSize: 26, color: "#fff", margin: 0, fontWeight: 700, lineHeight: 1.3 },
  ladderLine: { width: "50%", height: "2px", background: "linear-gradient(90deg, transparent, #E8620A, transparent)", marginTop: ".2rem", marginBottom: ".4rem" },
  featureList: { display: "flex", flexDirection: "column", gap: 8, alignSelf: "stretch" },
  featureItem: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", fontSize: 12, color: "rgba(255,255,255,.75)" },
  featureNum: { width: 22, height: 22, borderRadius: "50%", background: "rgba(232,98,10,.2)", border: "1px solid rgba(232,98,10,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#E8620A", flexShrink: 0 },

  /* شيل القديم */
  panelTitle: {}, panelSub: {}, dividerLine: {}, panelDesc: {},

  /* Card */
  rightPanel: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem 2.5rem" },
  card: { width: "100%", maxWidth: 400, background: "#fff", borderRadius: 16, border: "1px solid #DDE1E7", boxShadow: "0 4px 24px rgba(232,98,10,.08)", overflow: "hidden" },
  cardHeader: { background: "#FFF0E8", padding: "1.25rem 2rem 1rem", textAlign: "center", borderBottom: "1px solid #DDE1E7" },
  cardIcon: { width: 44, height: 44, borderRadius: 11, background: "#fff", border: "1px solid #DDE1E7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto .5rem" },
  cardTitle: { fontSize: 17, fontWeight: 600, color: "#1A2332", margin: "0 0 3px" },
  cardSub: { fontSize: 11, color: "#9AA0A8", margin: 0 },
  formBody: { padding: "1.25rem 2rem" },
  fieldGroup: { marginBottom: ".85rem" },
  fieldLabel: { display: "block", fontSize: 11, color: "#9AA0A8", marginBottom: 5, fontWeight: 600 },
  inputWrap: { display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #DDE1E7", borderRadius: 9, padding: "9px 12px", background: "#F4F5F7", transition: ".2s" },
  inputIcon: { flexShrink: 0 },
  input: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1A2332", fontFamily: "inherit", direction: "rtl" },
  errorBox: { display: "flex", alignItems: "center", gap: 6, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px", marginBottom: ".75rem", fontSize: 11, color: "#c0392b", direction: "rtl" },
  submitBtn: { width: "100%", padding: "11px", background: "#E8620A", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: ".2s", marginBottom: ".75rem" },
  spinner: { width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" },
  switchRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
  switchText: { fontSize: 12, color: "#9AA0A8" },
  switchLink: { fontSize: 12, color: "#2468A0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, padding: 0 },
  footer: { background: "#fff", borderTop: "1px solid #DDE1E7", padding: ".5rem 2rem", textAlign: "center", fontSize: 11, color: "#9AA0A8", flexShrink: 0 },
};
