import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import icon1 from "../assets/avatar4.jpg";
import icon2 from "../assets/avatar2.png";
import icon3 from "../assets/avatar3.jpg";
import heroAvatar from "../assets/avatar.png";

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div className="page">
      {/* NAV */}
      <nav>
        <div className="logos-zone">
          <img src={logo1} className="logo-img" alt="logo 1" />
          <div className="sep" />
          <img src={logo2} className="logo-img" alt="logo 2" />
          <div className="sep" />
          <img src={logo3} className="logo-img" alt="logo 3" />
          <div className="sep" />
          <div className="sys-name-block">
            <span className="sys-name-ar">اللائحة التدريبية للعاملين بالوزارة </span>
            <span className="sys-name-en">MWRI <em>Promotion</em> System</span>
          </div>
        </div>
        <div className="nav-btns">
          <button className="btn-o" onClick={() => navigate("/signin")}>تسجيل الدخول</button>
          <button className="btn-s" onClick={() => navigate("/signup")}>إنشاء حساب</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        {/* Left — blue panel */}
        <div className="hero-l">
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
                <button className="bp" onClick={() => navigate("/signup")}>إنشاء حساب</button>
                <button className="bg2" onClick={() => navigate("/signin")}>تسجيل الدخول</button>
              </div>
            </div>

            {/* Avatar */}
            <div className="hero-av-wrap">
              <div className="hero-av-ring hero-av-ring-1" />
              <div className="hero-av-ring hero-av-ring-2" />
              <div className="hero-av-border">
                <img src={heroAvatar} alt="" className="hero-av-img" />
              </div>
              <div className="hero-av-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right — floating card */}
        <div className="hero-r">
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
                      <circle cx="12" cy="8" r="4" stroke="#D9632A" strokeWidth="1.5" />
                      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#D9632A" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M19 4v6M16 7h6" stroke="#D9632A" strokeWidth="1.5" strokeLinecap="round" />
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
