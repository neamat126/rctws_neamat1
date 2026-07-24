import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import icon1 from "../assets/avatar4.jpg";
import icon2 from "../assets/avatar2.png";
import icon3 from "../assets/avatar3.jpg";
import dashboardImg from "../assets/avatar.png";
import DownloadAppCard from "../components/DownloadAppCard";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";
import { gsap } from "gsap";


export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");
  const w      = useWindowWidth();
  const mobile = isSmall(w);

  const navRef   = useRef(null);
  const heroLRef = useRef(null);
  const heroRRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(navRef.current,   { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo(heroLRef.current, { x: 50, opacity: 0 },  { x: 0, opacity: 1, duration: 0.65 }, "-=0.2")
        .fromTo(heroRRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65 }, "-=0.5")
        // النصوص في الـ hero-text تيجي بـ stagger من اليمين
        .fromTo(".hero-text .tag, .hero-text .h1, .hero-text .sub",
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, "-=0.4"
        )
        // الزراير
        .fromTo(".hero-text .btns .bp, .hero-text .btns .bg2",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.2"
        )
        .fromTo(".step", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.12 }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  // زرار click animation
  const animBtn = (e) => {
    gsap.fromTo(e.currentTarget,
      { scale: 0.94 },
      { scale: 1, duration: 0.25, ease: "back.out(2)" }
    );
  };

  return (
    <div className="page">
      {/* NAV */}
      <nav ref={navRef}>
        <div className="logos-zone" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src={logo2} className="logo-img" alt="logo 2" />
          <div className="sep" />
          <img src={logo1} className="logo-img" alt="logo 1" />
          <div className="sep" />
          <img src={logo3} className="logo-img" alt="logo 3" />
          <div className="sep" />
          <div className="sys-name-block">
            <span className="sys-name-ar">اللائحة التدريبية للعاملين بالوزارة </span>
            <span className="sys-name-en">MWRI <em>Promotion</em> System</span>
          </div>
        </div>
        <div className="nav-btns">
          <button className="btn-o" onClick={(e) => { animBtn(e); navigate("/signin"); }}>تسجيل الدخول</button>
          <button className="btn-s" onClick={(e) => { animBtn(e); navigate("/signup"); }}>إنشاء حساب</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        {/* Left — blue panel */}
        <div className="hero-l" ref={heroLRef}>
          <svg className="bg-svg" viewBox="0 0 420 400" preserveAspectRatio="none">
            <circle cx="380" cy="50" r="120" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"
              strokeDasharray="700" strokeDashoffset="700"
              style={{ animation: "draw 2.5s .4s forwards" }} />
            <circle cx="380" cy="50" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"
              strokeDasharray="700" strokeDashoffset="700"
              style={{ animation: "draw 2.5s .7s forwards" }} />
            <line x1="0" y1="400" x2="260" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1"
              strokeDasharray="700" strokeDashoffset="700"
              style={{ animation: "draw 2s .3s forwards" }} />
          </svg>

          {/* Text + Avatar side by side */}
          <div className="hero-l-inner">
            <div className="hero-text">
              <div className="tag">وزارة الموارد المائية والري</div>
              <h1 className="h1">اللائحة <span className="hl"> التدريبية</span>  للعاملين  <br/><span >بوزارة الموارد المائية والري</span></h1> <br/>
              <p className="sub">اطلب برامجك التدريبية من خلال المنصة<br />وقدم طلباتك على المنصة </p>
              <div className="btns">
                <button className="bp" onClick={(e) => { animBtn(e); navigate("/signup"); }}>إنشاء حساب</button>
                <button className="bg2" onClick={(e) => { animBtn(e); navigate("/signin"); }}>تسجيل الدخول</button>
              </div>
              <DownloadAppCard />
            </div>
          </div>

          {/* Dashboard Circle with Wave */}
          <div className="dash-preview-wrap">
            <div className="dash-blob" />

            {/* الدايرة الرئيسية */}
            <div className="dash-circle-wrap">
              {/* حلقات دوارة */}
              <div className="hero-av-ring hero-av-ring-1" />
              <div className="hero-av-ring hero-av-ring-2" />

              {/* الدايرة نفسها */}
              <svg className="dash-circle-svg" viewBox="0 0 220 220" width="220" height="220">
                <defs>
                  <clipPath id="dash-circle-clip">
                    <circle cx="110" cy="110" r="107" />
                  </clipPath>
                  <linearGradient id="dash-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#0d3b6e" />
                    <stop offset="100%" stopColor="#1a6fa8" />
                  </linearGradient>
                  <linearGradient id="dash-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#E8620A" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#E8620A" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="dash-wave-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* خلفية */}
                <circle cx="110" cy="110" r="107" fill="url(#dash-bg-grad)" />

                <g clipPath="url(#dash-circle-clip)">
                  {/* نقاط زخرفية */}
                  <circle cx="30"  cy="40"  r="22" fill="rgba(255,255,255,0.04)" />
                  <circle cx="185" cy="30"  r="32" fill="rgba(255,255,255,0.04)" />
                  <circle cx="195" cy="90"  r="14" fill="rgba(232,98,10,0.10)" />

                  {/* wave 1 */}
                  <path
                    d="M0 160 Q30 138 60 152 Q90 166 120 145 Q150 124 180 140 Q205 152 220 144 L220 220 L0 220 Z"
                    fill="url(#dash-wave-grad)"
                  />
                  {/* wave 2 */}
                  <path
                    d="M0 175 Q35 160 70 170 Q105 180 135 163 Q160 150 190 162 Q208 170 220 165 L220 220 L0 220 Z"
                    fill="url(#dash-wave-grad2)"
                  />
                </g>

                {/* إطار الدايرة */}
                <circle cx="110" cy="110" r="107" fill="none" stroke="rgba(232,98,10,0.35)" strokeWidth="1.5" />
              </svg>

              {/* شاشة PC جوا الدايرة */}
              <div className="dash-pc-wrap">
                <div className="dash-pc-screen" style={{height: '110px'}}>
                  <div className="dash-pc-bar">
                    <span style={{width:5,height:5,borderRadius:"50%",background:"#ff5f57",display:"inline-block"}}/>
                    <span style={{width:5,height:5,borderRadius:"50%",background:"#febc2e",display:"inline-block"}}/>
                    <span style={{width:5,height:5,borderRadius:"50%",background:"#28c840",display:"inline-block"}}/>
                  </div>
                  <img src={dashboardImg} alt="dashboard" className="dash-pc-img" />
                </div>
                <div className="dash-pc-neck" />
                <div className="dash-pc-base" />
              </div>

            </div>
          </div>

        </div>

        {/* Right — floating card */}
        <div className="hero-r" ref={heroRRef}>
          <div className="panel">
            <div className="tabs">
              <button className={`tab${activeTab === "signin" ? " active" : ""}`} onClick={() => setActiveTab("signin")}>تسجيل الدخول</button>
              <button className={`tab${activeTab === "signup" ? " active" : ""}`} onClick={() => setActiveTab("signup")}>إنشاء حساب</button>
            </div>

            {/* Sign In card */}
            {activeTab === "signin" && (
              <div className="form-card">
                <div className="fc-head">
                  <div className="icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="#1B4F7A" strokeWidth="1.5" />
                      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#1B4F7A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <strong> ........ </strong>
                  <span>أدخل بياناتك للدخول على حسابك</span>
                </div>
                <div className="field">
                  <label>الرقم القومي</label>
                  <div className="inp">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#1B4F7A" strokeWidth="1.5" />
                      <path d="M3 9h18" stroke="#1B4F7A" strokeWidth="1.5" />
                    </svg>
                    <span>أدخل رقمك القومي المكون من 14 رقم</span>
                  </div>
                </div>
                <div className="field">
                  <label>كلمة المرور</label>
                  <div className="inp">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#1B4F7A" strokeWidth="1.5" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#1B4F7A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>• • • • • • • •</span>
                  </div>
                </div>
                <button className="submit-btn" onClick={() => navigate("/signin")}>دخول</button>
                <div className="progress-mini">
                  <div className="pm-row">
                    <span><span className="pdot" />برامجك المطلوبة</span>
                    <span>٧ / ١٠</span>
                  </div>
                  <div className="pm-track"><div className="pm-fill" /></div>
                </div>
              </div>
            )}

            {/* Sign Up card */}
            {activeTab === "signup" && (
              <div className="form-card">
                <div className="fc-head">
                  <div className="icon-wrap" style={{ background: "var(--orange-light)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="#E8620A" strokeWidth="1.5" />
                      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#E8620A" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M19 4v6M16 7h6" stroke="#E8620A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <strong>إنشاء حساب جديد</strong>
                  <span>أدخل بياناتك الوظيفية للتسجيل</span>
                </div>
                <div className="field">
            
                </div>
                <div className="field">
               
                </div>
                <div className="field">
                  <label>الرقم القومي</label>
                  <div className="inp">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="#1B4F7A" strokeWidth="1.5" />
                      <path d="M2 10h20M7 15h2M11 15h2" stroke="#1B4F7A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>١٤ رقم</span>
                  </div>
                </div>
                <div className="field">
                  <label>كلمة المرور</label>
                  <div className="inp">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#1B4F7A" strokeWidth="1.5" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#1B4F7A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>أدخل كلمة مرور قوية</span>
                  </div>
                </div>
                <button className="submit-btn orange" onClick={() => navigate("/signup")}>إنشاء الحساب</button>
                <div className="divider">
                  <div className="dline" /><span>لديك حساب؟</span><div className="dline" />
                </div>
                <button onClick={() => setActiveTab("signin")}
                  style={{ width: "100%", padding: 8, border: "1px solid var(--border)", borderRadius: 7, fontSize: 12, background: "transparent", color: "var(--blue2)", cursor: "pointer", fontFamily: "inherit" }}>
                  تسجيل الدخول
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STEPS ROW */}
      <div className="steps-row">
        <div className="step">
          <img src={icon1} alt="" className="step-illus" />
          <div>
            <h3>سجّل وأنشئ حسابك</h3>
            <p>أنشئ حسابك ببياناتك الوظيفية وابدأ فوراً</p>
          </div>
        </div>
        <div className="step">
          <img src={icon2} alt="" className="step-illus" />
          <div>
            <h3>اطلب برامجك التدريبية</h3>
            <p>قدّم طلباتك على المنصة</p>
          </div>
        </div>
        <div className="step">
          <img src={icon3} alt="" className="step-illus" />
          <div>
            <h3>تابع تقدمك في اللائحة التدريبية</h3>
            <p>راجع مستوى الانجاز</p>
          </div>
        </div>
      </div>
    </div>
  );
}
