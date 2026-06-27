import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import imgT from "../assets/t.png";
import imgC from "../assets/c.png";
import imgF from "../assets/f.png";
import imgM from "../assets/m.png";
import imgW from "../assets/w.png";
import imgDefault from "../assets/bg1.png";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import API_BASE from "../api";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";

const COURSE_IMAGES = { t: imgT, c: imgC, f: imgF, m: imgM, w: imgW };
const getCourseImage = (code) => {
  const first = code?.trim().toLowerCase()[0];
  return COURSE_IMAGES[first] || imgDefault;
};

const getLevelCodeAndDuration = (levelName) => {
  const levelMap = {
    "الأول أ": { code: "1a", duration: "1 " },
    "الأول ب": { code: "1b", duration: "1 " },
    "التاني أ": { code: "2a", duration: "4  " },
    "الثاني أ": { code: "2a", duration: "4  " },
    "التاني ب": { code: "2b", duration: "3  " },
    "الثاني ب": { code: "2b", duration: "3  " },
    "الثالث ب": { code: "3b", duration: "6  " },
    "التالت ب": { code: "3b", duration: "6  " },
    "الثالث ج": { code: "3g", duration: "3  " },
    "مساعد باحث": { code: "3g", duration: "2  " },
    "باحث مساعد": { code: "3b", duration: "4  " },
    "باحث": { code: "2b", duration: "5  " },
    "استاذ باحث مساعد": { code: "2a", duration: "5  " },
  };
  return levelMap[levelName?.trim()] || { code: "—", duration: "—" };
};

const getCodeFromDepartments = (concatenatedDepts) => {
  if (!concatenatedDepts) return "—";
  const parts = concatenatedDepts.split('/').filter(p => p.trim());
  const codeMap = {
    "مصلحة الميكانيكا والكهرباء": 1,
    "قطاع شئون الري": 13,
    "قطاع التوسع الأفقي والمشروعات": 14,
    "قطاع الخزانات والقناطر الكبرى": 15,
    "قطاع المياه الجوفية": 16,
    "قطاع تطوير الري": 17,
    "قطاع تطوير وحماية نهر النيل وفرعيه": 18,
    "الهيئة المصرية العامة لمشروعات الصرف": 3,
    "الهيئة المصرية العامة لحماية الشواطئ": 4,
    "الهيئة المصرية العامة للمساحة": 6,
    "الهيئة العامة للسد العالي وخزان أسوان": 7,
    "المركز القومي لبحوث المياه": 8,
    "قطاع شئون مياه النيل": 10,
    "القطاع المشرف على مكتب الوزير": 11,
    "قطاع التفتيش الفني والمالي والإداري": 12,
    "قطاع الإدارة الإستراتيجية": 40,
    "قطاع المواردالمائية والري والبنيةالقومية - سيناء": 44,
    "مركز التدريب": 138,
  };
  for (let part of parts) {
    const trimmed = part.trim();
    if (codeMap[trimmed]) return codeMap[trimmed];
  }
  return "—";
};

const getActualYearsInPhase = (levelName, dateLevel, sectorCode) => {
  if (!levelName || !dateLevel) return "—";
  
  let finalLevelName = levelName;
  let levelCode = "";
  
  if (levelName?.trim() === "الثالث أ" || levelName?.trim() === "3a") {
    finalLevelName = "الثالث ب";
    levelCode = "3b";
  } else if (levelName?.trim() === "الأول ب" || levelName?.trim() === "1b") {
    finalLevelName = "الثاني أ";
    levelCode = "2a";
  } else {
    const levelInfo = getLevelCodeAndDuration(levelName);
    levelCode = levelInfo.code;
  }
  
  if (sectorCode === 8) {
    if (!["3g", "3b", "2a"].includes(levelCode)) {
      const levelInfo = getLevelCodeAndDuration(finalLevelName);
      return parseInt(levelInfo.duration) || 0;
    }
  }
  
  const levelInfo = getLevelCodeAndDuration(finalLevelName);
  const duration = parseInt(levelInfo.duration) || 0;
  
  if (duration === 0) return "—";
  
  const [year, month, day] = dateLevel.split('-');
  const promotionDate = new Date(year, month - 1, day);
  const cutoffDate = new Date(2025, 6, 1);
  
  if (promotionDate < cutoffDate) {
    let yearsDiff = cutoffDate.getFullYear() - promotionDate.getFullYear();
    let monthsDiff = cutoffDate.getMonth() - promotionDate.getMonth();
    
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }
    
    const totalDiff = yearsDiff + (monthsDiff / 12);
    const ceiledDiff = Math.ceil(totalDiff);
    
    const actualYears = duration - ceiledDiff;
    return Math.max(0, actualYears);
  } else {
    return duration;
  }
};

const getPhaseStatus = (dateLevel) => {
  if (!dateLevel) return "—";
  const [year, month] = dateLevel.split('-');
  return new Date(year, month - 1) < new Date(2025, 6) ? "مرحلة انتقالية" : "مرحلة عادية";
};

// ── SVG Icons ────────────────────────────────────────────────
const Svg = ({ children, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const IconDegree  = ({ color, size }) => <Svg color={color} size={size}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></Svg>;
const IconDate    = ({ color, size }) => <Svg color={color} size={size}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Svg>;
const IconClock   = ({ color, size }) => <Svg color={color} size={size}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>;
const IconYears   = ({ color, size }) => <Svg color={color} size={size}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></Svg>;
const IconOrg     = ({ color, size }) => <Svg color={color} size={size}><path d="M3 21h18M3 7v14M21 7v14M6 21V7M18 21V7M9 21v-4h6v4M3 7l9-4 9 4"/></Svg>;

const ICON_MAP = {
  degree: IconDegree,
  date:   IconDate,
  clock:  IconClock,
  years:  IconYears,
  org:    IconOrg,
};

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hiddenExpanded, setHiddenExpanded] = useState(false);
  const [manager, setManager] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nationalId = localStorage.getItem("nationalId");
  const w = useWindowWidth();
  const mobile = isSmall(w);

  useEffect(() => {
    if (!nationalId) { navigate("/"); return; }
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/GetDetails`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nationalId }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch { setError("تعذر تحميل البيانات"); }
      setLoading(false);
    };
    fetchData();
  }, [nationalId, navigate]);

  useEffect(() => {
    if (!data) return;
    const sectorCode = getCodeFromDepartments(data?.concatenated_departments);
    const actualYears = getActualYearsInPhase(data?.Levelname, data?.date_level, sectorCode);
    const phaseStatus = getPhaseStatus(data?.date_level);
    const levelInfo = getLevelCodeAndDuration(data?.Levelname);
    localStorage.setItem("sectorCode", sectorCode);
    localStorage.setItem("actualYearsInPhase", actualYears);
    localStorage.setItem("phaseStatus", phaseStatus);
    localStorage.setItem("levelCode", levelInfo.code || "");
    localStorage.setItem("levelDuration", levelInfo.duration?.trim() || "");
    localStorage.setItem("year_remaining", data?.year_remaining ?? "");
    localStorage.setItem("empname", data?.empname || "");
    localStorage.setItem("Levelname", data?.Levelname || "");
    localStorage.setItem("QualificationName", data?.QualificationName || "");
    localStorage.setItem("SpecializationName", data?.SpecializationName || "");
    localStorage.setItem("BirthDate", data?.BirthDate || "");
    localStorage.setItem("ActualHiringDate", data?.ActualHiringDate || "");
    localStorage.setItem("Tel", data?.Tel || "");
    localStorage.setItem("concatenated_departments", data?.concatenated_departments || "");
  }, [data]);

  useEffect(() => {
    if (!nationalId) return;
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/getData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ national_id: nationalId.trim() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const arr = Array.isArray(json) ? json : json.data || [];
        setPrograms(arr);
        // خزن أكواد البرامج المكتملة
        const codes = arr.map(p => (p.course_ID || p.course_id || "").trim().toLowerCase()).filter(Boolean);
        localStorage.setItem("completedCourseCodes", JSON.stringify(codes));
      } catch (e) { console.error("Programs fetch error:", e); }
    };
    fetchPrograms();
  }, [nationalId]);

  useEffect(() => {
    if (!nationalId) return;
    const fetchManager = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/GetManagerByEmployeeNationalID`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nationalId: nationalId.trim() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const arr = Array.isArray(json) ? json : json?.value || [];
        const firstManager = arr[0] || null;
        setManager(firstManager);
        localStorage.setItem("ManagerName", firstManager?.ManagerName || "");
        localStorage.setItem("Manager_Nid", firstManager?.Manger_Nid || "");
        // هل الموظف الحالي مدير؟ لو nationalId موجود كـ Manger_Nid بـ LevelID=2
        const isManager = arr.some(r => r.LevelID === 2 && r.Manger_Nid?.trim() === nationalId.trim());
        localStorage.setItem("isManager", isManager ? "1" : "0");
      } catch (e) { console.error("Manager fetch error:", e); }
    };
    fetchManager();
  }, [nationalId]);

  const handleLogout = () => {
    ["nationalId","sectorCode","actualYearsInPhase","phaseStatus",
     "empname","Levelname","QualificationName","SpecializationName",
     "BirthDate","ActualHiringDate","Tel","concatenated_departments",
     "levelCode","levelDuration","year_remaining","completedCourseCodes",
     "ManagerName","Manager_Nid","isManager"
    ].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  if (loading) return <div style={s.center}><div style={s.spinner}/><p style={s.loadingText}>جاري التحميل...</p></div>;
  if (error) return (
    <div style={s.center}>
      <p style={{ color: "#E24B4A", fontWeight: 600 }}>{error}</p>
      <button style={s.btn} onClick={handleLogout}>رجوع</button>
    </div>
  );

  const sectorCode  = getCodeFromDepartments(data?.concatenated_departments);
  const actualYears = getActualYearsInPhase(data?.Levelname, data?.date_level, sectorCode);
  const phaseStatus = getPhaseStatus(data?.date_level);
  const levelInfo   = getLevelCodeAndDuration(data?.Levelname);
  const initials    = data?.empname?.trim().split(' ').slice(0,2).map(n => n[0]).join(' ') || "—";
  const parentOrg   = data?.concatenated_departments?.split('/').filter(p => p.trim())[0] || "—";
  const deptParts   = data?.concatenated_departments?.split('/').filter(p => p.trim()) || [];
  const deptLabels  = ["الجهة الأم","القطاع","الإدارة المركزية","الإدارة العامة","الفرع","القسم"];

  const VISIBLE = 4;
  const visiblePrograms = showAll ? programs : programs.slice(0, VISIBLE);

  const isManager = localStorage.getItem("isManager") === "1";

  const NAV_ITEMS = [
    { path: "/profile",  label: "الملف الشخصي",          icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>, section: "main" },
    { path: "/programs", label: "برامج تم الحصول عليها", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><polyline points="9 11 11 13 15 9"/></svg>, badge: programs.length, section: "main" },
    { path: "/required", label: "البرامج المطلوبة",       icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><circle cx="12" cy="10" r="2"/><path d="M12 12v3"/></svg>, section: "main" },
    ...(isManager ? [{ path: "/manager-requests", label: "طلبات المهندسين", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, section: "main" }] : []),
    { path: "/schedule", label: "كتيب اللائحة التدريبية", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, section: "other" },
    { path: "/settings", label: "الإعدادات",              icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>, section: "other" },
  ];

  const sidebarW = mobile ? (sidebarOpen ? "240px" : "0px") : (collapsed ? "64px" : "240px");
  const effectiveCollapsed = mobile ? false : collapsed;

  const canAccessRequired = () => {
    const spec  = (localStorage.getItem("SpecializationName") || "").trim();
    const qual  = (localStorage.getItem("QualificationName")  || "").trim();
    const org   = (localStorage.getItem("concatenated_departments") || "").split('/')[0]?.trim() || "";
    const specL = spec.toLowerCase();

    const isMechOrg = org === "مصلحة الميكانيكا والكهرباء";

    // الشرط الأساسي: مؤهل بكالوريوس هندسة OR تخصص contains مدني
    const passesBase = qual === "بكالوريوس هندسة" || specL.includes("مدني") || specL.includes("مدنى");
    if (!passesBase) return false;

    // الحالة 1: مدني أو مساحة + مش مصلحة ميكانيكا
    const isCivilOrSurvey = specL.includes("مدني") || specL.includes("مدنى") || specL.includes("مساحة");
    if (isCivilOrSurvey && !isMechOrg) return true;

    // الحالة 2: تخصصات كهرباء/ميكانيكا + مصلحة ميكانيكا
    const isMechElec = ["قوى","ميكانيكا و كهرباء","ميكانيكا","الكترونيات","اتصالات","الكترونيات و اتصالات","مدني"]
      .some(k => specL.includes(k.toLowerCase()));
    if (isMechElec && isMechOrg) return true;

    return false;
  };

  return (
    <div style={s.container}>
      {/* Mobile hamburger button */}
      {mobile && (
        <button
          style={s.hamburger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            {sidebarOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      )}

      {/* Mobile overlay */}
      {mobile && sidebarOpen && (
        <div style={s.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <aside style={{ ...s.sidebar, width: sidebarW, display: mobile && !sidebarOpen ? "none" : "flex", position: mobile ? "fixed" : "fixed" }}>

        {/* Collapse toggle */}
        {!mobile && (
        <button
          style={s.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "توسيع" : "تصغير"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        )}

        {/* Avatar — top */}
        {!effectiveCollapsed && (
          <div style={s.avatarSection}>
            <div style={s.avatarWrap}>
              <div style={s.avatar}>{initials}</div>
              <span style={s.avatarOnline}/>
            </div>
            <h3 style={s.employeeName}>{data?.empname || "—"}</h3>
            <p style={s.employeeRole}>{data?.Levelname || "—"}</p>
            <span style={s.activePill}>
              <span style={s.activeDot}/>
              نشط
            </span>
          </div>
        )}

        {/* Nav — top */}
        <nav style={{ ...s.nav, padding: "12px 8px", flex: 1 }}>
          {!effectiveCollapsed && <p style={s.navSectionLabel}>القائمة</p>}
          {NAV_ITEMS.filter(i => i.section === "main").map(({ path, label, icon, badge }) => {
            const active = location.pathname === path;
            const hovered = hoveredNav === path;
            return (
              <div key={path} style={{ position: "relative" }}>
                <a
                  href="#"
                  style={{
                    ...s.navLink,
                    justifyContent: effectiveCollapsed ? "center" : "flex-start",
                    ...(active ? s.navLinkActive : {}),
                    ...(hovered && !active ? s.navLinkHover : {}),
                  }}
                  onClick={e => {
                    e.preventDefault();
                    if (mobile) setSidebarOpen(false);
                    if (path === "/required") {
                      if (canAccessRequired()) { navigate(path); }
                      else { alert("جاري استكمال باقي البرامج"); }
                    } else { navigate(path); }
                  }}
                  onMouseEnter={() => setHoveredNav(path)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <span style={{ ...s.navIcon, ...(active ? s.navIconActive : {}) }}>{icon}</span>
                  {!effectiveCollapsed && <span style={{ flex: 1 }}>{label}</span>}
                  {!effectiveCollapsed && badge !== undefined && (
                    <span style={{ ...s.badge, ...(active ? s.badgeActive : {}) }}>{badge}</span>
                  )}
                </a>
                {effectiveCollapsed && hovered && !mobile && (
                  <div style={s.tooltip}>{label}{badge !== undefined ? ` (${badge})` : ""}</div>
                )}
              </div>
            );
          })}

          {/* Divider */}
          <div style={s.navDivider}>
            {!effectiveCollapsed && <span style={s.navDividerLabel}>أخرى</span>}
          </div>

          {NAV_ITEMS.filter(i => i.section === "other").map(({ path, label, icon }) => {
            const active = location.pathname === path;
            const hovered = hoveredNav === path;
            return (
              <div key={path} style={{ position: "relative" }}>
                <a
                  href="#"
                  style={{
                    ...s.navLink,
                    justifyContent: effectiveCollapsed ? "center" : "flex-start",
                    ...(active ? s.navLinkActive : {}),
                    ...(hovered && !active ? s.navLinkHover : {}),
                  }}
                  onClick={e => {
                    e.preventDefault();
                    if (mobile) setSidebarOpen(false);
                    if (path === "/schedule") { navigate("/guide"); }
                    else { navigate(path); }
                  }}
                  onMouseEnter={() => setHoveredNav(path)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <span style={{ ...s.navIcon, ...(active ? s.navIconActive : {}) }}>{icon}</span>
                  {!effectiveCollapsed && <span style={{ flex: 1 }}>{label}</span>}
                </a>
                {effectiveCollapsed && hovered && !mobile && (
                  <div style={s.tooltip}>{label}</div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer — logos + logout */}
        <div style={s.sidebarFooter}>
          {!effectiveCollapsed && (
            <div style={s.sidebarLogos}>
              <img src={logo2} alt="logo2" style={s.sidebarLogo}/>
              <img src={logo1} alt="logo1" style={s.sidebarLogo}/>
              <img src={logo3} alt="logo3" style={s.sidebarLogo}/>
            </div>
          )}
          <div style={s.footerDivider}/>
          <button
            style={{ ...s.logoutBtn, justifyContent: effectiveCollapsed ? "center" : "flex-start" }}
            onClick={handleLogout}
            title="تسجيل خروج"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!collapsed && "تسجيل خروج"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ ...s.main, marginRight: mobile ? "0" : sidebarW, paddingTop: mobile ? "56px" : "24px", padding: mobile ? "56px 12px 24px" : "24px 28px 40px" }}>
        {/* Row 1 — 3 cards */}
        <div style={{ ...s.statsGrid3, gridTemplateColumns: "repeat(3,1fr)" }}>
          <StatCard icon="degree" label="الدرجة الوظيفية"  value={data?.Levelname || "—"}       color="#7C3AED" />
          <StatCard icon="date"   label="تاريخ التعيين"    value={data?.ActualHiringDate || "—"} color="#0891B2" />
          <StatCard icon="clock"  label="تاريخ آخر ترقية" value={data?.date_level || "—"}       color="#059669" />
        </div>
        {/* Row 2 — 2 cards */}
        <div style={{ ...s.statsGrid2, gridTemplateColumns: "1fr 1fr" }}>
          <StatCard icon="years" label="السنوات الفعلية للائحة" value={actualYears} color="#D97706" />
          <StatCard icon="org"   label="الجهة المستوى الاول"    value={parentOrg}   color="#2563EB" small />
        </div>

        {/* Two columns */}
        <div style={{ ...s.twoColumn, gridTemplateColumns: mobile ? "1fr" : "1fr 1fr" }}>
          {/* Left */}
          <div style={s.column}>
            <div style={s.card}>
              <div style={s.cardTitleRow}>
                <h4 style={s.cardTitle}>البيانات الشخصية</h4>
                <span style={s.employeeBadge}>موظف</span>
              </div>
              <DataRow label="الرقم القومي"  value={data?.nationalId || nationalId} />
              <DataRow label="تاريخ التعيين" value={data?.ActualHiringDate || "—"} />
              <DataRow label="تاريخ الميلاد" value={data?.BirthDate || "—"} />
              <DataRow label="المؤهل"         value={data?.QualificationName || "—"} />
              <DataRow label="التخصص"         value={data?.SpecializationName || "—"} />
              <DataRow label="رقم الهاتف"    value={data?.Tel || "—"} />
            </div>

            <div style={s.card}>
              <h4 style={s.cardTitle}>تفاصيل الوظيفة</h4>
              <DataRow label="الدرجة الحالية" value={data?.Levelname || "—"} highlightBlue />
              <DataRow label="سنة آخر ترقية" value={data?.date_level || "—"} highlightOrange />
              <DataRow label="المدير المباشر" value={manager?.ManagerName || "—"} />
              <DataRow label="ر.ق المدير"    value={manager?.Manger_Nid  || "—"} />
              <DataRow
                label="الجهة"
                value={deptParts.length === 0 ? "—" : deptParts.join(" - ")}
              />
            </div>

            <div style={s.card}>
              <div style={s.cardTitleRow}>
                <h4 style={s.cardTitle}>بيانات مخفية</h4>
                <button style={s.toggleCardBtn} onClick={() => setHiddenExpanded(!hiddenExpanded)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: hiddenExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  {hiddenExpanded ? "إخفاء" : "عرض"}
                </button>
              </div>
              {hiddenExpanded && (
                <>
                  <DataRow label="كود الدرجة"         value={levelInfo.code} />
                  <DataRow label="المدة البينية"      value={levelInfo.duration.trim() + " سنوات"} />
                  <DataRow label="مستوى الوظيفة"     value={data?.CurrentJobLevel || "—"} />
                  <DataRow label="كود القطاع"         value={sectorCode} />
                  <DataRow label="حالة المرحلة"       value={phaseStatus} />
                  <DataRow label="السنوات في المرحلة" value={actualYears} />
                  {deptParts.map((part, i) => (
                    <DataRow key={i} label={deptLabels[i] || `المستوى ${i+1}`} value={part.trim() || "—"} />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Right — Programs */}
          <div style={s.column}>
            <div style={s.card}>
              <div style={s.cardTitleRow}>
                <h4 style={s.cardTitle}>البرامج التدريبية التي تم الحصول عليها خلال اخر  ثلاث سنوات</h4>
                <span style={s.programsCountBadge}>{programs.length} برنامج</span>
              </div>
              <div style={s.programsList}>
                {visiblePrograms.map((prog, i) => (
                  <ProgramCard
                    key={i}
                    name={prog.course_Name || prog.course_name || "—"}
                    code={prog.course_ID   || prog.course_id   || "—"}
                  />
                ))}
              </div>
              {programs.length > VISIBLE && (
                <button style={s.seeMoreBtn} onClick={() => setShowAll(!showAll)}>
                  {showAll ? "عرض أقل" : `عرض الكل (${programs.length - VISIBLE} برنامج إضافي)`}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={s.warningNote}>
          &#9888; ملاحظة: في حالة وجود خطأ في البيانات يرجى الرجوع إلى الموارد البشرية بجهة عملك الأصلية
        </div>
      </main>
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────
function StatCard({ icon, label, value, color = "#0C447C", small }) {
  const IconComp = ICON_MAP[icon];
  return (
    <div style={s.statCard}>
      <div style={{ ...s.statIconBox, backgroundColor: color + "18" }}>
        {IconComp && <IconComp color={color} size={20} />}
      </div>
      <p style={{
        ...s.statValue,
        color,
        fontSize: small ? "12px" : "15px",
        lineHeight: small ? "1.4" : "1.2",
      }}>{value}</p>
      <p style={s.statLabel}>{label}</p>
    </div>
  );
}

// ── DataRow ──────────────────────────────────────────────────
function DataRow({ label, value, highlightBlue, highlightOrange }) {
  return (
    <div style={s.dataRow}>
      <span style={s.dataLabel}>{label}</span>
      <span style={{
        ...s.dataValue,
        ...(highlightBlue   ? s.highlightBlue   : {}),
        ...(highlightOrange ? s.highlightOrange : {}),
      }}>{value}</span>
    </div>
  );
}

// ── ProgramCard (single column, smaller) ─────────────────────
function ProgramCard({ name, code }) {
  const img = getCourseImage(code);
  return (
    <div style={s.programCard}>
      <div style={s.programCardImg}>
        <img src={img} alt={name} style={s.programImg} />
        {code !== "—" && <span style={s.programCardCode}>{code}</span>}
      </div>
      <div style={s.programCardBody}>
        <p style={s.programCardName}>{name}</p>
        <div style={s.programCardFooter}>
          <span style={s.programCardStars}>&#9733;&#9733;&#9733;&#9733;</span>
          <span style={s.programCardBadge}>مكتمل</span>
        </div>
      </div>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────
const s = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f0f2f5", direction: "rtl" },
  sidebar: {
    position: "fixed", right: 0, top: 0, height: "100vh",
    backgroundColor: "#041d52",
    display: "flex", flexDirection: "column",
    overflowY: "auto", overflowX: "hidden",
    zIndex: 100,
    boxShadow: "-2px 0 20px rgba(0,0,0,0.3)",
    transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
  },
  collapseBtn: {
    alignSelf: "flex-end", margin: "12px 10px 4px",
    width: "28px", height: "28px", borderRadius: "6px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.5)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  avatarSection: {
    textAlign: "center", padding: "16px 16px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  avatarWrap: {
    position: "relative", width: "72px", margin: "0 auto 12px", display: "inline-block",
  },
  avatar: {
    width: "72px", height: "72px", borderRadius: "50%",
    backgroundColor: "#1a3a6b", border: "2px solid rgba(55,138,221,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "26px", fontWeight: "700", color: "#7db8e8",
  },
  avatarOnline: {
    position: "absolute", bottom: "3px", left: "3px",
    width: "12px", height: "12px", borderRadius: "50%",
    backgroundColor: "#10B981", border: "2px solid #041d52",
  },
  employeeName: { color: "#fff", fontSize: "13px", fontWeight: "700", margin: "0 0 3px", lineHeight: 1.4 },
  employeeRole: { color: "rgba(255,255,255,0.45)", fontSize: "11px", margin: "0 0 10px" },
  activePill: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    backgroundColor: "rgba(16,185,129,0.15)", color: "#6EE7B7",
    border: "1px solid rgba(16,185,129,0.3)",
    padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "600",
  },
  activeDot: {
    width: "6px", height: "6px", borderRadius: "50%",
    backgroundColor: "#10B981", display: "inline-block",
  },
  logoutBtn: {
    width: "100%", padding: "9px 12px", display: "flex", alignItems: "center", gap: "10px",
    backgroundColor: "rgba(239,68,68,0.08)", color: "rgba(252,165,165,0.85)",
    border: "1px solid rgba(239,68,68,0.18)", borderRadius: "8px",
    cursor: "pointer", fontSize: "12px", fontWeight: "600",
  },  nav: { display: "flex", flexDirection: "column", gap: "2px" },
  navSectionLabel: {
    color: "rgba(255,255,255,0.22)", fontSize: "9px", fontWeight: "700",
    letterSpacing: "1.2px", textTransform: "uppercase",
    margin: "4px 0 6px 4px", whiteSpace: "nowrap",
  },
  navLink: {
    color: "rgba(255,255,255,0.55)", textDecoration: "none",
    padding: "9px 12px", borderRadius: "8px", fontSize: "12px",
    display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
    whiteSpace: "nowrap", overflow: "hidden",
    transition: "background 0.12s, color 0.12s",
  },
  navLinkActive: {
    backgroundColor: "rgba(55,138,221,0.18)",
    color: "#fff",
    borderRight: "3px solid #378ADD",
    paddingRight: "9px",
  },
  navLinkHover: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.85)",
  },
  navIcon: { display: "flex", color: "rgba(255,255,255,0.35)", flexShrink: 0 },
  navIconActive: { color: "#7db8e8" },
  navDivider: {
    display: "flex", alignItems: "center", gap: "8px",
    margin: "14px 4px 8px",
  },
  navDividerLabel: {
    color: "rgba(255,255,255,0.22)", fontSize: "9px", fontWeight: "700",
    letterSpacing: "1.2px", textTransform: "uppercase", whiteSpace: "nowrap",
  },
  badge: {
    backgroundColor: "#1e4d8c", color: "#7db8e8",
    padding: "1px 7px", borderRadius: "10px",
    fontSize: "10px", fontWeight: "700", flexShrink: 0,
  },
  badgeActive: { backgroundColor: "#378ADD", color: "#fff" },
  tooltip: {
    position: "absolute", right: "100%", top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#1a3a6b", color: "#fff",
    fontSize: "11px", fontWeight: "600",
    padding: "5px 10px", borderRadius: "6px",
    whiteSpace: "nowrap", marginRight: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    pointerEvents: "none", zIndex: 200,
  },
  sidebarFooter: {
    padding: "8px 8px 14px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  sidebarLogos: {
    display: "flex", justifyContent: "center", alignItems: "center",
    gap: "6px", padding: "8px 4px 10px",
  },
  sidebarLogo: { height: "40px", maxWidth: "60px", objectFit: "contain" },
  footerDivider: { height: "1px", backgroundColor: "rgba(255,255,255,0.07)", margin: "0 0 10px" },
  userCard: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "8px 6px", borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  userCardAvatar: {
    position: "relative", width: "34px", height: "34px", flexShrink: 0,
    borderRadius: "50%", backgroundColor: "#1a3a6b",
    border: "1.5px solid rgba(55,138,221,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  userCardInitials: { fontSize: "13px", fontWeight: "700", color: "#7db8e8" },
  userCardOnline: {
    position: "absolute", bottom: "0px", left: "0px",
    width: "9px", height: "9px", borderRadius: "50%",
    backgroundColor: "#10B981", border: "1.5px solid #041d52",
  },
  userCardInfo: { flex: 1, minWidth: 0 },
  userCardName: {
    color: "#fff", fontSize: "11.5px", fontWeight: "600",
    margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  userCardRole: {
    color: "rgba(255,255,255,0.4)", fontSize: "10px",
    margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  logoutIconBtn: {
    width: "28px", height: "28px", borderRadius: "6px", flexShrink: 0,
    backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
    color: "rgba(252,165,165,0.8)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  main: { flex: 1, padding: "24px 28px 40px", transition: "margin-right 0.22s cubic-bezier(.4,0,.2,1)" },
  center: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", gap: 16, direction: "rtl" },
  loadingText: { color: "#0C447C", fontWeight: 600, marginTop: 12 },
  spinner: { width: 34, height: 34, border: "3px solid #E3E8EF", borderTop: "3px solid #0C447C", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  btn: { padding: "10px 28px", backgroundColor: "#0C447C", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: 14 },

  // Stats
  statsGrid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "10px" },
  statsGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" },
  statCard: {
    backgroundColor: "#fff", border: "1px solid #E8ECF2", borderRadius: "12px",
    padding: "14px 16px", display: "flex", flexDirection: "column",
    alignItems: "center", textAlign: "center", gap: "6px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  statIconBox: {
    width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  statText: { flex: 1, textAlign: "right" },
  statLabel: { fontSize: "10px", color: "#9AA3AF", margin: 0, lineHeight: "1.3" },
  statValue: { fontWeight: "700", margin: 0, wordBreak: "break-word" },

  // Layout
  twoColumn: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" },
  column: { display: "flex", flexDirection: "column", gap: "14px" },
  card: { backgroundColor: "#fff", border: "1px solid #E8ECF2", borderRadius: "12px", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: "13px", fontWeight: "700", color: "#0C447C", margin: 0 },
  cardTitleRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid #EEF1F6",
  },
  employeeBadge: {
    backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "11px",
    fontWeight: "700", padding: "3px 12px", borderRadius: "12px",
  },

  // DataRow
  dataRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F5F7FA", fontSize: "12.5px" },
  dataLabel: { color: "#6B7280", fontWeight: "600" },
  dataValue: { color: "#1A2535", fontWeight: "500", textAlign: "left", maxWidth: "60%", wordBreak: "break-word", lineHeight: "1.5" },
  highlightBlue: { backgroundColor: "#EBF4FF", color: "#1D4ED8", fontWeight: "700", padding: "2px 10px", borderRadius: "6px", fontSize: "12px" },
  highlightOrange: { backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: "700", padding: "2px 10px", borderRadius: "6px", fontSize: "12px" },

  // Programs
  programsCountBadge: { backgroundColor: "#EEF2FF", color: "#4338CA", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", border: "1px solid #C7D2FE" },
  programsList: { display: "flex", flexDirection: "column", gap: "8px" },
  programCard: { display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #E8ECF2", backgroundColor: "#fff", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  programCardImg: { position: "relative", width: "150px", minHeight: "85px", flexShrink: 0, overflow: "hidden" },
  programImg: { width: "100%", height: "100%", objectFit: "cover" },
  programCardCode: { position: "absolute", bottom: "4px", left: "4px", backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "9px", fontWeight: "700", padding: "1px 5px", borderRadius: "4px" },
  programCardBody: { flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", justifyContent: "center" },
  programCardName: { fontSize: "12px", fontWeight: "600", color: "#1A2535", margin: "0 0 6px", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textAlign: "right" },
  programCardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  programCardStars: { fontSize: "11px", color: "#F59E0B" },
  programCardBadge: { fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "8px", backgroundColor: "#E6F4EE", color: "#0F5132" },
  toggleCardBtn: {
    display: "flex", alignItems: "center", gap: "4px",
    padding: "3px 10px", borderRadius: "6px",
    backgroundColor: "#EEF2FF", color: "#4338CA",
    border: "1px solid #C7D2FE", cursor: "pointer",
    fontSize: "11px", fontWeight: "600",
  },
  seeMoreBtn: { width: "100%", marginTop: "10px", padding: "8px", backgroundColor: "#EEF2FF", color: "#4338CA", border: "1px solid #C7D2FE", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700" },

  // Warning
  warningNote: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#FAEEDA", border: "1px solid #EF9F27", color: "#854F0B", padding: "10px 14px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.6" },

  // Mobile
  hamburger: {
    position: "fixed", top: "12px", right: "12px", zIndex: 200,
    width: "40px", height: "40px", borderRadius: "10px",
    backgroundColor: "#041d52", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  overlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 99,
  },
};
