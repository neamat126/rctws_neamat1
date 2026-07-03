export function addNotification({ title, message, icon = "🔔" }) {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  const date = new Date().toLocaleDateString("ar-EG", {
    year: "numeric", month: "long", day: "numeric"
  });
  notifications.push({ title, message, icon, date, read: false });
  localStorage.setItem("notifications", JSON.stringify(notifications));
}

export function getUnreadCount() {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  return notifications.filter(n => !n.read).length;
}
