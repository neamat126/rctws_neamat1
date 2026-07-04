import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";
import { getUnreadCount } from "../utils/notifications";

export default function Sidebar({ empname, levelname, programs = [], onRequiredClick, onLogout }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [collapsed, setCollapsed]   = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const w      = useWindowWidth();
  const mobile = isSmall(w);

  const sidebarW        = mobile ? (sidebarOpen ? "240px" : "0px") : (collapsed ? "64px" : "240px");
  const effectiveCollapsed = mobile ? false : collapsed;

  const isManager     = localStorage.getItem("isManager") === "1";
  const unreadNotifs  = getUnreadCount();
  const initials      = empname?.trim().split(" ").slice(0, 2).map(n => n[0]).join(" ") || "—";

  const NAV_ITEMS = [
    { path: "/profile",  label: "الملف الشخصي",          section: "main",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
    { path: "/programs", label: "برامج تم الحصول عليها", section: "main", badge: programs.length,
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><polyline points="9 11 11 13 15 9"/></svg> },
    { path: "/required", label: "البرامج المطلوبة",       section: "main",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><circle cx="12" cy="10" r="2"/><path d="M12 12v3"/></svg> },
    ...(isManager ? [{ path: "/manager-requests", label: "طلبات المهندسين", section: "main",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> }] : []),
    { path: "/notifications", label: "الإشعارات", section: "main", badge: unreadNotifs || undefined,
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
    { path: "/schedule", label: "كتيب اللائحة التدريبية", section: "other",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { path: "/settings", label: "الرسائل", section: "other",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
  ];

  const getActivePath = (path) => {
    if (path === "/schedule") return location.pathname === "/guide";
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    if (mobile) setSidebarOpen(false);
    if (path === "/required") {
      if (onRequiredClick) onRequiredClick();
      else navigate(path);
    } else if (path === "/schedule") {
      navigate("/guide");
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* Hamburger */}
      {mobile && (
        <button style={s.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            {sidebarOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      )}

      {/* Overlay */}
      {mobile && sidebarOpen && (
        <div style={s.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside style={{ ...s.sidebar, width: sidebarW, display: mobile && !sidebarOpen ? "none" : "flex" }}>

        {/* Collapse toggle */}
        {!mobile && (
          <button style={s.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}

        {/* Avatar */}
        {!effectiveCollapsed && (
          <div style={s.avatarSection}>
            <div style={s.avatarWrap}>
              <div style={s.avatar}>{initials}</div>
              <span style={s.avatarOnline}/>
            </div>
            <h3 style={s.employeeName}>{empname || "—"}</h3>
            <p style={s.employeeRole}>{levelname || "—"}</p>
            <span style={s.activePill}><span style={s.activeDot}/>نشط</span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ ...s.nav, padding: "12px 8px", flex: 1 }}>
          {!effectiveCollapsed && <p style={s.navSectionLabel}>القائمة</p>}

          {NAV_ITEMS.filter(i => i.section === "main").map(({ path, label, icon, badge }) => {
            const active  = getActivePath(path);
            const hovered = hoveredNav === path;
            return (
              <div key={path} style={{ position: "relative" }}>
                <a href="#" style={{ ...s.navLink, justifyContent: effectiveCollapsed ? "center" : "flex-start", ...(active ? s.navLinkActive : {}), ...(hovered && !active ? s.navLinkHover : {}) }}
                  onClick={e => { e.preventDefault(); handleNavClick(path); }}
                  onMouseEnter={() => setHoveredNav(path)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <span style={{ ...s.navIcon, ...(active ? s.navIconActive : {}) }}>{icon}</span>
                  {!effectiveCollapsed && <span style={{ flex: 1 }}>{label}</span>}
                  {!effectiveCollapsed && badge !== undefined && (
                    <span style={{ ...s.badge, ...(active ? s.badgeActive : {}) }}>{badge}</span>
                  )}
                </a>
                {effectiveCollapsed && hovered && !mobile && <div style={s.tooltip}>{label}{badge ? ` (${badge})` : ""}</div>}
              </div>
            );
          })}

          <div style={s.navDivider}>
            {!effectiveCollapsed && <span style={s.navDividerLabel}>أخرى</span>}
          </div>

          {NAV_ITEMS.filter(i => i.section === "other").map(({ path, label, icon }) => {
            const active  = getActivePath(path);
            const hovered = hoveredNav === path;
            return (
              <div key={path} style={{ position: "relative" }}>
                <a href="#" style={{ ...s.navLink, justifyContent: effectiveCollapsed ? "center" : "flex-start", ...(active ? s.navLinkActive : {}), ...(hovered && !active ? s.navLinkHover : {}) }}
                  onClick={e => { e.preventDefault(); handleNavClick(path); }}
                  onMouseEnter={() => setHoveredNav(path)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <span style={{ ...s.navIcon, ...(active ? s.navIconActive : {}) }}>{icon}</span>
                  {!effectiveCollapsed && <span style={{ flex: 1 }}>{label}</span>}
                </a>
                {effectiveCollapsed && hovered && !mobile && <div style={s.tooltip}>{label}</div>}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={s.sidebarFooter}>
          {!effectiveCollapsed && (
            <div style={{ ...s.sidebarLogos, cursor: "pointer" }} onClick={() => navigate("/")}>
              <img src={logo2} alt="logo2" style={s.sidebarLogo}/>
              <img src={logo1} alt="logo1" style={s.sidebarLogo}/>
              <img src={logo3} alt="logo3" style={s.sidebarLogo}/>
            </div>
          )}
          <div style={s.footerDivider}/>
          <button style={{ ...s.logoutBtn, justifyContent: effectiveCollapsed ? "center" : "flex-start" }}
            onClick={onLogout} title="تسجيل خروج">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!effectiveCollapsed && "تسجيل خروج"}
          </button>
        </div>
      </aside>
    </>
  );
}

// expose sidebar width helper
export function useSidebarWidth() {
  const w      = useWindowWidth();
  const mobile = isSmall(w);
  return mobile ? "0px" : "240px";
}

const s = {
  hamburger: { position: "fixed", top: "12px", right: "12px", zIndex: 200, width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#041d52", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
  overlay:   { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 99 },
  sidebar:   { position: "fixed", right: 0, top: 0, height: "100vh", backgroundColor: "#041d52", display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden", zIndex: 100, boxShadow: "-2px 0 20px rgba(0,0,0,0.3)", transition: "width 0.22s cubic-bezier(.4,0,.2,1)" },
  collapseBtn: { alignSelf: "flex-end", margin: "12px 10px 4px", width: "28px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarSection: { textAlign: "center", padding: "16px 16px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  avatarWrap: { position: "relative", width: "72px", margin: "0 auto 12px", display: "inline-block" },
  avatar:     { width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#1a3a6b", border: "2px solid rgba(55,138,221,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: "700", color: "#7db8e8" },
  avatarOnline: { position: "absolute", bottom: "3px", left: "3px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10B981", border: "2px solid #041d52" },
  employeeName: { color: "#fff", fontSize: "13px", fontWeight: "700", margin: "0 0 3px", lineHeight: 1.4 },
  employeeRole: { color: "rgba(255,255,255,0.45)", fontSize: "11px", margin: "0 0 10px" },
  activePill:  { display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: "rgba(16,185,129,0.15)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.3)", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "600" },
  activeDot:   { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981", display: "inline-block" },
  nav:         { display: "flex", flexDirection: "column", gap: "2px" },
  navSectionLabel: { color: "rgba(255,255,255,0.22)", fontSize: "9px", fontWeight: "700", letterSpacing: "1.2px", textTransform: "uppercase", margin: "4px 0 6px 4px", whiteSpace: "nowrap" },
  navLink:     { color: "rgba(255,255,255,0.55)", textDecoration: "none", padding: "9px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", transition: "background 0.12s, color 0.12s" },
  navLinkActive: { backgroundColor: "rgba(55,138,221,0.18)", color: "#fff", borderRight: "3px solid #378ADD", paddingRight: "9px" },
  navLinkHover:  { backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)" },
  navIcon:     { display: "flex", color: "rgba(255,255,255,0.35)", flexShrink: 0 },
  navIconActive: { color: "#7db8e8" },
  navDivider:  { display: "flex", alignItems: "center", gap: "8px", margin: "14px 4px 8px" },
  navDividerLabel: { color: "rgba(255,255,255,0.22)", fontSize: "9px", fontWeight: "700", letterSpacing: "1.2px", textTransform: "uppercase", whiteSpace: "nowrap" },
  badge:       { backgroundColor: "#1e4d8c", color: "#7db8e8", padding: "1px 7px", borderRadius: "10px", fontSize: "10px", fontWeight: "700", flexShrink: 0 },
  badgeActive: { backgroundColor: "#378ADD", color: "#fff" },
  tooltip:     { position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)", backgroundColor: "#1a3a6b", color: "#fff", fontSize: "11px", fontWeight: "600", padding: "5px 10px", borderRadius: "6px", whiteSpace: "nowrap", marginRight: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", pointerEvents: "none", zIndex: 200 },
  sidebarFooter: { padding: "8px 8px 14px", borderTop: "1px solid rgba(255,255,255,0.07)" },
  sidebarLogos:  { display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", padding: "8px 4px 10px" },
  sidebarLogo:   { height: "40px", maxWidth: "60px", objectFit: "contain" },
  footerDivider: { height: "1px", backgroundColor: "rgba(255,255,255,0.07)", margin: "0 0 10px" },
  logoutBtn:     { width: "100%", padding: "9px 12px", display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(239,68,68,0.08)", color: "rgba(252,165,165,0.85)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
};
