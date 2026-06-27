import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgT from "../assets/t.png";
import imgC from "../assets/c.png";
import imgF from "../assets/f.png";
import imgM from "../assets/m.png";
import imgW from "../assets/w.png";
import imgDefault from "../assets/bg1.png";
import imgContent from "../assets/content.png";
import imgHours from "../assets/hours.png";
import a1 from "../assets/a1.png";
import a2 from "../assets/a2.png";
import a3 from "../assets/a3.png";
import a4 from "../assets/a4.png";
import a5 from "../assets/a5.png";
import a7 from "../assets/a7.png";
import a8 from "../assets/a8.png";
import a9 from "../assets/a9.png";
import API_BASE from "../api";

const NUM_ICONS = { 1: a1, 2: a2, 3: a3, 4: a4, 5: a5, 6: null, 7: a7, 8: a8, 9: a9 };

const COURSE_IMAGES = { t: imgT, c: imgC, f: imgF, m: imgM, w: imgW };
const getCourseImage = (code) => {
  const first = code?.trim().toLowerCase()[0];
  return COURSE_IMAGES[first] || imgDefault;
};

export default function Required() {
  const navigate  = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [activeTab, setActiveTab] = useState("ministry");

  const org_code     = localStorage.getItem("sectorCode");
  const Degree       = localStorage.getItem("levelCode");
  const Years_Remain = localStorage.getItem("actualYearsInPhase");
  const empname      = localStorage.getItem("empname");

  useEffect(() => {
    if (!org_code || !Degree) {
      setError("بيانات الموظف غير مكتملة، يرجى العودة للملف الشخصي");
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses_for_promotion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ org_code, Degree, Years_Remain }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch (e) {
        console.error(e);
        setError("تعذر تحميل البرامج المطلوبة");
      }
      setLoading(false);
    };
    load();
  }, [org_code, Degree, Years_Remain]);

  const fundamental = data?.["Fundamental _courses"] || data?.Fundamental_courses || [];
  const optional    = data?.Optional_courses || [];
  const optRequired = data?.["No of Required optional courses"] || 0;

  const ministryList = fundamental.filter(c => c.Requirement === "M");
  const sectorList   = fundamental.filter(c => c.Requirement === "O");

  // actual years remaining — لو 0 أو مش موجود نحط 1 عشان منقسمش على صفر
  const actualYears = Math.max(1, parseInt(localStorage.getItem("actualYearsInPhase")) || 1);

  const TABS = [
    { key: "ministry", label: "متطلبات وزارة", count: ministryList.length, color: "#1D4ED8" },
    { key: "sector",   label: "متطلبات قطاع",  count: sectorList.length,   color: "#059669" },
    { key: "optional", label: "اختياري",        count: optional.length,     color: "#D97706",
      sub: optRequired ? `مطلوب ${optRequired}` : null },
  ];

  const [subView, setSubView] = useState("all");

  const currentList =
    activeTab === "ministry" ? ministryList :
    activeTab === "sector"   ? sectorList   : optional;

  // عدد البرامج المطلوبة في السنة = ceil(total / actualYears)
  const perYear = Math.ceil(currentList.length / actualYears);
  const displayList = subView === "required" ? currentList.slice(0, perYear) : currentList;

  const getCode = (c) => c.fundamental_course_code || c.optional_course_code || "—";
  const getName = (c) => c.fundamental_course_name || c.optional_course_name || "—";

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
        <div style={{ flex: 1 }}>
          <h2 style={s.title}>البرامج المطلوبة للائحة التدريبية</h2>
          {empname && <p style={s.sub}>{empname}</p>}
        </div>
      </div>

      {/* Params */}
      <div style={s.paramsRow}>
        <Chip label="كود القطاع"   value={org_code} />
        <Chip label="كود الدرجة"   value={Degree} />
        <Chip label="السنوات الفعلية" value={Years_Remain + " سنوات"} />
      </div>

      {loading ? (
        <div style={s.center}><div style={s.spinner}/><p style={s.loadingText}>جاري التحميل...</p></div>
      ) : error ? (
        <div style={s.center}><p style={{ color: "#E24B4A", fontWeight: 600 }}>{error}</p></div>
      ) : (
        <>
          {/* Tabs */}
          <div style={s.tabsRow}>
            {TABS.map(tab => {
              const active = activeTab === tab.key;
              return (
                <button key={tab.key}
                  style={{
                    ...s.tab,
                    backgroundColor: active ? tab.color : "#E8ECF2",
                    color: active ? "#fff" : "#6B7280",
                    borderBottom: "none",
                  }}
                  onClick={() => { setActiveTab(tab.key); setSubView("all"); }}
                >
                  {tab.label}
                  <span style={{
                    ...s.tabCount,
                    backgroundColor: active ? "rgba(255,255,255,0.25)" : "#fff",
                    color: active ? "#fff" : tab.color,
                  }}>
                    {tab.count}
                  </span>
                  {tab.sub && <span style={s.tabSub}>{tab.sub}</span>}
                </button>
              );
            })}
          </div>

          {/* Sub tabs: Required / All */}
          <div style={s.subTabsRow}>
            <button
              style={{ ...s.subTab, ...(subView === "required" ? s.subTabActive : {}) }}
              onClick={() => setSubView("required")}
            >
              Required
              <span style={{ ...s.subTabCount, ...(subView === "required" ? s.subTabCountActive : {}) }}>
                {perYear}
              </span>
            </button>
            <button
              style={{ ...s.subTab, ...(subView === "all" ? s.subTabActive : {}) }}
              onClick={() => setSubView("all")}
            >
              All
              <span style={{ ...s.subTabCount, ...(subView === "all" ? s.subTabCountActive : {}) }}>
                {currentList.length}
              </span>
            </button>
          </div>

          {/* Grid */}
          {displayList.length === 0 ? (
            <div style={s.center}><p style={{ color: "#9AA3AF", fontSize: 13 }}>لا توجد برامج في هذا القسم</p></div>
          ) : (
            <div style={s.grid}>
              {displayList.map((c, i) => (
                <CourseCard
                  key={`${activeTab}-${subView}-${getCode(c)}-${i}`}
                  name={getName(c)}
                  code={getCode(c)}
                  hours={c.Hours}
                  type={activeTab}
                  courseData={c}
                  subView={subView}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Chip({ label, value }) {
  return <span style={s.chip}>{label}: <b>{value}</b></span>;
}

function CourseCard({ name, code, hours, type, courseData, subView }) {
  const img = getCourseImage(code);
  const [status, setStatus]     = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const completedCodes = JSON.parse(localStorage.getItem("completedCourseCodes") || "[]");
  const isCompleted = completedCodes.includes(code?.trim().toLowerCase());

  const badge =
    type === "ministry" ? { text: "وزارة",  bg: "#EFF6FF", color: "#1D4ED8" } :
    type === "sector"   ? { text: "قطاع",   bg: "#ECFDF5", color: "#065F46" } :
                          { text: "اختياري", bg: "#FEF3C7", color: "#92400E" };

  const handleRequest = async (e) => {
    e.stopPropagation();
    if (status === "loading") return;
    setStatus("loading");

    const deptParts = (localStorage.getItem("concatenated_departments") || "").split('/').filter(p => p.trim());
    const payload = {
      national_id:         localStorage.getItem("nationalId")         || "",
      trainee_name:        localStorage.getItem("empname")            || "",
      Mobile:              localStorage.getItem("Tel")                || "",
      specialization:      localStorage.getItem("SpecializationName") || "",
      Depart:              deptParts[3] || deptParts[2] || "",
      sector:              deptParts[1] || "",
      org_code:            localStorage.getItem("sectorCode")         || "",
      organization:        deptParts[0] || "",
      Degree:              localStorage.getItem("levelCode")          || "",
      Years_Remain:        localStorage.getItem("levelDuration")      || "",
      Actual_years_remain: localStorage.getItem("year_remaining")     || "",
      course_code:         code,
      course_type:         type === "optional" ? "o" : "f",
      Message:             "",
      Manager_ID:          localStorage.getItem("Manager_Nid")        || "",
      Manager_name:        localStorage.getItem("ManagerName")        || "",
    };

    try {
      const res  = await fetch(`${API_BASE}/api/upload_Data`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      console.log("📤 Upload Response:", json);
      const st   = json?.status || "";
      if (st.includes("already") || st.includes("selected")) setStatus("exists:تم الإرسال بالفعل");
      else if (st === "success" || st === "sent" || st === "") setStatus("success");
      else setStatus("api:" + st);
    } catch { setStatus("error"); }
  };

  const btnStyle = {
    ...s.requestBtn,
    ...(status === "success"        ? s.btnSuccess :
        status?.startsWith("exists")? s.btnExists  :
        status === "error"          ? s.btnError   :
        status === "loading"        ? s.btnLoading :
        status?.startsWith("api:")  ? s.btnExists  : {}),
  };
  const btnText =
    status === "loading"          ? "..." :
    status === "success"          ? "تم ✓" :
    status?.startsWith("exists:") ? status.replace("exists:", "") :
    status === "error"            ? "خطأ"  :
    status?.startsWith("api:")    ? status.replace("api:", "") :
    "Request";

  return (
    <>
      <div style={s.card}>
        {/* Image */}
        <div style={s.cardImg}>
          <img src={img} alt={name} style={s.img} />
        </div>
        {/* Body */}
        <div style={s.cardBody}>
          {/* Row: logo + code + name + request btn */}
          <div style={s.cardTop}>
            <div style={s.cardTopRight}>
              <img src="/ministy.jpg" alt="ministry" style={s.ministryIcon}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={s.cardCode}>{code}</span>
                <p style={s.cardName}>{name}</p>
              </div>
            </div>
            {isCompleted ? (
              <span style={s.completedBadge}>Completed</span>
            ) : subView === "all" ? null : (
              <button style={btnStyle} onClick={handleRequest} disabled={status === "loading"}>
                {btnText}
              </button>
            )}
          </div>
          {/* Stars */}
          <div style={s.cardStars}>&#9733;&#9733;&#9733;&#9733;</div>
          {/* Hours + See More */}
          <div style={s.cardBottom}>
            <div style={s.hoursRow}>
              <img src={imgHours} alt="hours" style={s.hoursIcon}/>
              <span style={s.hoursText}>Hours : {hours}</span>
            </div>
            <button style={s.seeMoreBtn} onClick={() => setShowPopup(true)}>See More</button>
          </div>
        </div>
      </div>

      {showPopup && (
        <CoursePopup course={courseData} name={name} code={code} hours={hours} badge={badge} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}

function CoursePopup({ course, name, code, hours, badge, onClose }) {
  const competencies = [1,2,3,4,5,6].map(i => ({ num: i, val: course[`comptency${i}`] })).filter(c => c.val);
  const contentItems = [1,2,3,4,5].map(i => ({
    num: i,
    ar: course[`content-A${i}`],
    en: course[`content-E${i}`],
  })).filter(c => c.ar && c.ar.trim() && c.ar.trim() !== '-' && c.ar.trim() !== '0');

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.popup} onClick={e => e.stopPropagation()}>
        {/* Top image */}
        <div style={s.popupImgWrap}>
          <img src={imgContent} alt="content" style={s.popupImg}/>
        </div>
        <div style={s.popupInner}>
          <h3 style={s.popupMainTitle}>Course Contents</h3>
          <p style={s.popupCourseName}>{name}</p>

          {/* Row 01 — code */}
          <PopupRow num={1} label="كود البرنامج" value={code} />

          {/* Rows 02-07 — competencies */}
          {[1,2,3,4,5,6].map(i => (
            <PopupRow key={i} num={i+1}
              label={`اسم الجدارة ${i}`}
              value={course[`comptency${i}`] || "------"}
            />
          ))}

          {/* Row 08 — hours */}
          <PopupRow num={8} label="عدد الساعات المعتمدة" value={hours} />

          {/* Row 09 — content */}
          {contentItems.length > 0 && (
            <div style={s.popupRow}>
              <img src={NUM_ICONS[9] || a9} alt="09" style={s.numIcon}/>
              <div style={{ flex: 1 }}>
                <p style={s.popupRowLabel}>المحتوى (عربي و انجليزي) :</p>
                {contentItems.map((c, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <p style={s.contentAr}>- المحتوى عربي : {c.ar}</p>
                    {c.en && <p style={s.contentEn}>- English Content: {c.en}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button style={s.okBtn} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

function PopupRow({ num, label, value }) {
  const icon = NUM_ICONS[num];
  return (
    <div style={s.popupRow}>
      {icon ? <img src={icon} alt={`0${num}`} style={s.numIcon}/> : <span style={s.numFallback}>0{num}</span>}
      <p style={s.popupRowText}><span style={s.popupRowLabel}>{label} :</span> {value}</p>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", backgroundColor: "#f4f6fa", direction: "rtl", padding: "24px 28px 40px", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" },
  backBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "#fff", border: "1px solid #E8ECF2", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#0C447C", fontWeight: "600" },
  title: { fontSize: "18px", fontWeight: "700", color: "#0D2137", margin: "0 0 2px" },
  sub: { fontSize: "12px", color: "#9AA3AF", margin: 0 },
  paramsRow: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  chip: { backgroundColor: "#fff", border: "1px solid #E8ECF2", borderRadius: "8px", padding: "5px 12px", fontSize: "12px", color: "#6B7280" },
  tabsRow: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  tab: { display: "flex", alignItems: "center", gap: "7px", padding: "10px 20px", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", transition: "all 0.15s" },
  tabActive: {},
  tabCount: { fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" },
  tabSub: { fontSize: "10px", backgroundColor: "rgba(255,255,255,0.3)", padding: "1px 7px", borderRadius: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" },

  // Card
  card: { backgroundColor: "#fff", borderRadius: "14px", overflow: "hidden", border: "1px solid #E8ECF2", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" },
  cardImg: { width: "100%", height: "150px", overflow: "hidden", flexShrink: 0 },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: "10px 12px", display: "flex", flexDirection: "column", flex: 1 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "6px" },
  cardTopRight: { display: "flex", alignItems: "flex-start", gap: "6px", flex: 1, minWidth: 0 },
  ministryIcon: { width: "28px", height: "28px", objectFit: "contain", flexShrink: 0, borderRadius: "4px", marginTop: "2px" },
  cardCode: { fontSize: "12px", fontWeight: "700", color: "#0C447C", display: "block", marginBottom: "2px" },
  cardName: { fontSize: "12px", fontWeight: "600", color: "#1A2535", margin: 0, lineHeight: "1.4", textAlign: "right", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardStars: { fontSize: "13px", color: "#F59E0B", marginBottom: "6px" },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "6px" },
  hoursRow: { display: "flex", alignItems: "center", gap: "5px" },
  hoursIcon: { width: "16px", height: "16px", objectFit: "contain" },
  hoursText: { fontSize: "12px", color: "#6B7280" },
  seeMoreBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700", color: "#D97706", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", padding: 0 },
  reqBadge: { fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "8px" },
  requestBtn: { padding: "6px 10px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "700", backgroundColor: "#1D4ED8", color: "#fff", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", minWidth: "72px", textAlign: "center", lineHeight: "1.4", whiteSpace: "normal", wordBreak: "break-word", flexShrink: 0 },
  completedBadge: { fontSize: "11px", fontWeight: "700", color: "#DC2626", flexShrink: 0, backgroundColor: "#FEE2E2", padding: "5px 10px", borderRadius: "8px", border: "1px solid #FECACA" },
  btnExists:  { backgroundColor: "#D97706" },
  btnError:   { backgroundColor: "#DC2626" },
  btnLoading: { backgroundColor: "#9CA3AF", cursor: "not-allowed" },

  // Popup
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  popup: { backgroundColor: "#fff", borderRadius: "16px", width: "100%", maxWidth: "500px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" },
  popupImgWrap: { width: "100%", height: "200px", overflow: "hidden" },
  popupImg: { width: "100%", height: "100%", objectFit: "cover" },
  popupInner: { padding: "20px" },
  popupMainTitle: { fontSize: "18px", fontWeight: "700", color: "#1D4ED8", textAlign: "center", margin: "0 0 6px" },
  popupCourseName: {
    fontSize: "13px", fontWeight: "700", color: "#1D4ED8",
    textAlign: "center", margin: "0 0 16px",
    lineHeight: "1.5", padding: "8px 16px",
    backgroundColor: "#EEF2FF",
    borderRadius: "8px",
    border: "1px solid #C7D2FE",
  },
  popupRow: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "14px", direction: "rtl" },
  numIcon: { width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 },
  numFallback: { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#E8ECF2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 },
  popupRowText: { fontSize: "13px", color: "#374151", lineHeight: "1.6", margin: 0, textAlign: "right" },
  popupRowLabel: { fontWeight: "700", color: "#0C447C" },
  contentAr: { fontSize: "12px", color: "#374151", margin: "0 0 4px", lineHeight: "1.6", textAlign: "right" },
  contentEn: { fontSize: "11px", color: "#6B7280", margin: 0, lineHeight: "1.5", textAlign: "left", direction: "ltr" },
  okBtn: { width: "100%", padding: "12px", backgroundColor: "#1D4ED8", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "700", marginTop: "10px", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" },

  subTabsRow: { display: "flex", gap: "8px", marginBottom: "16px" },
  subTab: { display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", borderRadius: "8px", border: "1px solid #E8ECF2", backgroundColor: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#6B7280", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" },
  subTabActive: { backgroundColor: "#0D2137", color: "#fff", border: "1px solid #0D2137" },
  subTabCount: { fontSize: "11px", fontWeight: "700", padding: "1px 7px", borderRadius: "10px", backgroundColor: "#E8ECF2", color: "#6B7280" },
  subTabCountActive: { backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" },
  spinner: { width: 32, height: 32, border: "3px solid #E3E8EF", borderTop: "3px solid #0C447C", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#0C447C", fontWeight: 600 },
};
