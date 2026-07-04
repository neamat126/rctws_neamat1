import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";

export default function Notifications() {
  const navigate = useNavigate();
  const w = useWindowWidth();
  const mobile = isSmall(w);

  const empname  = localStorage.getItem("empname") || "";
  const levelname = localStorage.getItem("Levelname") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // اقرأ كل الإشعارات المخزنة
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem("notifications", JSON.stringify(updated));
    window.location.reload();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const sidebarW  = mobile ? "0px" : "260px";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6fa", direction: "rtl" }}>
      <Sidebar empname={empname} levelname={levelname} onLogout={handleLogout} />

      <div style={{ flex: 1, marginRight: sidebarW, padding: mobile ? "56px 16px 32px" : "24px 28px 40px", fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ flex: 1 }}>
          <h2 style={s.title}>الإشعارات</h2>
          {unreadCount > 0 && <p style={s.sub}>{unreadCount} إشعار غير مقروء</p>}
        </div>
        {unreadCount > 0 && (
          <button style={s.markBtn} onClick={markAllRead}>
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 48 }}>🔔</span>
          <p style={s.emptyText}>لا توجد إشعارات</p>
        </div>
      ) : (
        <div style={s.list}>
          {[...notifications].reverse().map((notif, i) => (
            <div key={i} style={{ ...s.card, ...(notif.read ? {} : s.cardUnread) }}>
              <div style={s.cardIcon}>{notif.icon || "🔔"}</div>
              <div style={s.cardBody}>
                <p style={s.cardTitle}>{notif.title}</p>
                <p style={s.cardMsg}>{notif.message}</p>
                <span style={s.cardDate}>{notif.date}</span>
              </div>
              {!notif.read && <div style={s.unreadDot} />}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", backgroundColor: "#f4f6fa", direction: "rtl", padding: "24px 28px 40px", fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px", flexWrap: "wrap" },
  backBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "#fff", border: "1px solid #E8ECF2", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#0C447C", fontWeight: "600" },
  title: { fontSize: "18px", fontWeight: "700", color: "#0D2137", margin: "0 0 2px" },
  sub: { fontSize: "12px", color: "#D97706", margin: 0, fontWeight: 600 },
  markBtn: { padding: "7px 14px", backgroundColor: "#EEF2FF", color: "#4338CA", border: "1px solid #C7D2FE", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "inherit" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: 12 },
  emptyText: { fontSize: 14, color: "#9AA3AF" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: { display: "flex", alignItems: "flex-start", gap: "14px", backgroundColor: "#fff", borderRadius: "14px", padding: "16px", border: "1px solid #E8ECF2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative" },
  cardUnread: { backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" },
  cardIcon: { fontSize: 28, flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: "14px", fontWeight: "700", color: "#1A2332", margin: "0 0 4px" },
  cardMsg: { fontSize: "13px", color: "#6B7280", lineHeight: 1.6, margin: "0 0 6px" },
  cardDate: { fontSize: "11px", color: "#9AA3AF" },
  unreadDot: { width: 10, height: 10, borderRadius: "50%", backgroundColor: "#F59E0B", flexShrink: 0, marginTop: 4 },
};

