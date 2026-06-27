import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api";
import useWindowWidth, { isSmall } from "../hooks/useWindowWidth";

export default function ManagerRequests() {
  const navigate   = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const managerId   = localStorage.getItem("nationalId");
  const managerName = localStorage.getItem("empname");
  const apiManagerId = localStorage.getItem("Manager_Nid") || managerId;
  const w = useWindowWidth();
  const mobile = isSmall(w);

  useEffect(() => {
    if (!managerId) { navigate("/"); return; }
    const load = async () => {
      try {
        console.log("Manager_Nid from storage:", localStorage.getItem("Manager_Nid"));
        console.log("nationalId from storage:", managerId);
        console.log("Sending Manager_ID:", apiManagerId);
        const res = await fetch(`${API_BASE}/api/trainees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Manager_ID: apiManagerId }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        console.log("Trainees API response:", json);
        setTrainees(json?.value || json?.data || (Array.isArray(json) ? json : []));
      } catch (e) {
        console.error(e);
        setError("تعذر تحميل الطلبات");
      }
      setLoading(false);
    };
    load();
  }, [managerId, navigate]);

  const totalCourses = trainees.reduce((s, t) => s + (t.courses?.length || 0), 0);

  return (
    <div style={{ ...s.page, padding: mobile ? "16px 12px 32px" : "24px 28px 40px" }}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/profile")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          رجوع
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={s.title}>طلبات المهندسين — برامج اللائحة التدريبية</h2>
          <p style={s.sub}>للموافقة على طلب اضغط Accept</p>
        </div>
        {!loading && (
          <div style={s.statsRow}>
            <span style={s.statChip}>{trainees.length} مهندس</span>
            <span style={{ ...s.statChip, backgroundColor: "#EEF2FF", color: "#4338CA" }}>{totalCourses} طلب</span>
          </div>
        )}
      </div>

      {loading ? (
        <div style={s.center}><div style={s.spinner}/><p style={s.loadingText}>جاري التحميل...</p></div>
      ) : error ? (
        <div style={s.center}><p style={{ color: "#E24B4A", fontWeight: 600 }}>{error}</p></div>
      ) : trainees.length === 0 ? (
        <div style={s.center}><p style={{ color: "#9AA3AF" }}>لا توجد طلبات حالياً</p></div>
      ) : (
        <div style={s.list}>
          {trainees.map((trainee, ti) => (
            <TraineeCard
              key={ti}
              trainee={trainee}
              managerId={managerId}
              managerName={managerName}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TraineeCard({ trainee, managerId, managerName }) {
  const initials = trainee.trainee_name?.trim().split(' ').slice(0,2).map(n => n[0]).join(' ') || "—";

  return (
    <div style={s.traineeCard}>
      {/* Trainee info */}
      <div style={s.traineeHeader}>
        <div style={s.traineeAvatar}>{initials}</div>
        <div style={s.traineeInfo}>
          <p style={s.traineeName}>{trainee.trainee_name}</p>
          <p style={s.traineeId}>ID: {trainee.national_id}</p>
          <div style={s.traineeMeta}>
            <span style={s.metaChip}>{trainee.Degree}</span>
            <span style={s.metaChip}>{trainee.specialization}</span>
            <span style={{ ...s.metaChip, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {trainee.organization}
            </span>
          </div>
        </div>
        <span style={s.courseCount}>{trainee.courses?.length || 0} برنامج</span>
      </div>

      {/* Courses */}
      <div style={s.coursesList}>
        {(trainee.courses || []).map((course, ci) => (
          <CourseRow
            key={ci}
            course={course}
            trainee={trainee}
            managerId={managerId}
            managerName={managerName}
          />
        ))}
      </div>
    </div>
  );
}

function CourseRow({ course, trainee, managerId, managerName }) {
  const [status, setStatus] = useState(null);

  const handleAccept = async () => {
    if (status === "loading" || status === "success") return;
    setStatus("loading");

    const payload = {
      national_id:   trainee.national_id   || "",
      trainee_name:  trainee.trainee_name  || "",
      Mobile:        trainee.Mobile        || "",
      specialization: trainee.specialization || "",
      Depart:        trainee.Depart        || "",
      organization:  trainee.organization  || "",
      Degree:        trainee.Degree        || "",
      Years_Remain:  trainee.Years_Remain  || "",
      course_code:   course.course_code    || "",
      course_type:   course.course_type    || "f",
      confirmation:  "ok",
      Message:       "",
      Manager_ID:    managerId             || "",
      Manager_name:  managerName           || "",
    };

    try {
      const jsonStr = JSON.stringify(payload);
      const encoded = `filename=&filedata=${encodeURIComponent(jsonStr)}&otherdata=${encodeURIComponent(jsonStr)}`;

      const res = await fetch(`${API_BASE}/api/upload_Data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      console.log("Accept response:", json);
      const st = json?.status || "";
      if (st.includes("already") || st.includes("selected")) setStatus("exists");
      else if (st === "success" || st === "sent" || st === "") setStatus("success");
      else setStatus("api:" + st);
    } catch { setStatus("error"); }
  };

  const btnStyle = {
    ...s.acceptBtn,
    ...(status === "success" ? s.acceptBtnSuccess :
        status === "exists"  ? s.acceptBtnExists  :
        status === "error"   ? s.acceptBtnError   :
        status === "loading" ? s.acceptBtnLoading :
        status?.startsWith("api:") ? s.acceptBtnExists : {}),
  };

  const btnText =
    status === "loading"          ? "..." :
    status === "success"          ? "تمت الموافقة ✓" :
    status === "exists"           ? "تم الإرسال مسبقاً" :
    status === "error"            ? "خطأ" :
    status?.startsWith("api:")    ? status.replace("api:", "") :
    "Accept";

  return (
    <div style={{ ...s.courseRow, flexWrap: "wrap", gap: "8px" }}>
      <div style={s.courseInfo}>
        <span style={s.courseCode}>{course.course_code}</span>
        <span style={s.courseName}>{course.Program_title || "—"}</span>
        <span style={{ ...s.courseType, ...(course.course_type === "o" ? s.courseTypeO : {}) }}>
          {course.course_type === "o" ? "اختياري" : "أساسي"}
        </span>
      </div>
      <button style={btnStyle} onClick={handleAccept} disabled={status === "loading" || status === "success"}>
        {btnText}
      </button>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", backgroundColor: "#f4f6fa", direction: "rtl", padding: "24px 28px 40px", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" },
  header: { display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "24px", flexWrap: "wrap" },
  backBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "#fff", border: "1px solid #E8ECF2", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#0C447C", fontWeight: "600" },
  title: { fontSize: "18px", fontWeight: "700", color: "#0D2137", margin: "0 0 4px" },
  sub: { fontSize: "12px", color: "#D97706", margin: 0, fontWeight: "600" },
  statsRow: { display: "flex", gap: "8px" },
  statChip: { backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px" },

  list: { display: "flex", flexDirection: "column", gap: "16px" },

  // Trainee card
  traineeCard: { backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #E8ECF2", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  traineeHeader: { display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderBottom: "1px solid #F0F4F8", backgroundColor: "#FAFBFC" },
  traineeAvatar: { width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#0C447C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#7db8e8", flexShrink: 0 },
  traineeInfo: { flex: 1 },
  traineeName: { fontSize: "14px", fontWeight: "700", color: "#0D2137", margin: "0 0 2px" },
  traineeId: { fontSize: "11px", color: "#9AA3AF", margin: "0 0 6px" },
  traineeMeta: { display: "flex", gap: "6px", flexWrap: "wrap" },
  metaChip: { backgroundColor: "#EEF2FF", color: "#4338CA", fontSize: "10px", fontWeight: "600", padding: "2px 8px", borderRadius: "6px" },
  courseCount: { backgroundColor: "#FEF3C7", color: "#92400E", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", flexShrink: 0 },

  // Course row
  coursesList: { padding: "8px 0" },
  courseRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid #F5F7FA", gap: "12px" },
  courseInfo: { display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 },
  courseCode: { fontSize: "11px", fontWeight: "700", color: "#0C447C", backgroundColor: "#EBF4FF", padding: "2px 8px", borderRadius: "5px", flexShrink: 0 },
  courseName: { fontSize: "13px", color: "#374151", fontWeight: "500", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  courseType: { fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "6px", backgroundColor: "#ECFDF5", color: "#065F46", flexShrink: 0 },
  courseTypeO: { backgroundColor: "#FEF3C7", color: "#92400E" },

  acceptBtn: { padding: "7px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700", backgroundColor: "#1D4ED8", color: "#fff", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", flexShrink: 0, minWidth: "90px", textAlign: "center" },
  acceptBtnSuccess: { backgroundColor: "#059669", cursor: "default" },
  acceptBtnExists:  { backgroundColor: "#D97706", cursor: "default" },
  acceptBtnError:   { backgroundColor: "#DC2626" },
  acceptBtnLoading: { backgroundColor: "#9CA3AF", cursor: "not-allowed" },

  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: 12 },
  spinner: { width: 32, height: 32, border: "3px solid #E3E8EF", borderTop: "3px solid #0C447C", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#0C447C", fontWeight: 600 },
};
