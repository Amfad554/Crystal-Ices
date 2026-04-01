import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";

const BASE_URL = "https://crystalbackend.onrender.com";

const statusColor = (s) =>
  ({ PENDING: "#F59E0B", PROCESSING: "#3B82F6", COMPLETED: "#10B981", CANCELLED: "#EF4444", ACCEPTED: "#10B981", REJECTED: "#EF4444" }[s] || "#94A3B8");

const statMeta = {
  PENDING:    { icon: "⏳", label: "Pending",    bg: "rgba(245,158,11,0.12)",  accent: "#F59E0B" },
  PROCESSING: { icon: "⚙️",  label: "Processing", bg: "rgba(59,130,246,0.12)", accent: "#3B82F6" },
  COMPLETED:  { icon: "✅",  label: "Completed",  bg: "rgba(16,185,129,0.12)", accent: "#10B981" },
  CANCELLED:  { icon: "🚫",  label: "Cancelled",  bg: "rgba(239,68,68,0.12)",  accent: "#EF4444" },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [viewItem, setViewItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, title: "", message: "", onConfirm: null, danger: false });

  const [stats, setStats] = useState({ PENDING: 0, PROCESSING: 0, COMPLETED: 0, CANCELLED: 0 });
  const [totals, setTotals] = useState({ equipment: 0, staff: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [staff, setStaff] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "System User",
  });

  const [modals, setModals] = useState({ equipment: false, staff: false });
  const [forms, setForms] = useState({
    equipment: { name: "", category: "Heavy Duty", brand: "", dailyRate: "", region: "Lagos", description: "" },
    staff: { name: "", role: "", specialty: "" },
  });

  const showToast = (msg, type = "info") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3500);
  };

  const showConfirm = (title, message, onConfirm, danger = true) => {
    setConfirmModal({ show: true, title, message, onConfirm, danger });
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");
    return { Authorization: `Bearer ${token}`, "x-login-time": loginTime || Date.now().toString() };
  };

  /* ── Email notification helper ── */
  const sendEmailNotification = async (type, payload) => {
    try {
      await fetch(`${BASE_URL}/api/notifications/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ type, ...payload }),
      });
    } catch (err) {
      console.warn("Email notification failed (non-critical):", err);
    }
  };

  const fetchData = async () => {
    if (activeTab === "profile") return;
    setLoading(true);
    try {
      const endpoints = {
        overview: "api/admin/stats",
        inquiries: "api/inquiry/all",
        inventory: "api/admin/equipment/all",
        staff: "api/admin/staff/all",
        subscribers: "api/users/newsletter-all",
        applications: "api/users/applications/all",
      };
      const res = await fetch(`${BASE_URL}/${endpoints[activeTab]}`, { headers: getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem("token"); localStorage.removeItem("user"); localStorage.removeItem("loginTime");
        window.dispatchEvent(new Event("auth-state-change"));
        navigate("/auth"); return;
      }
      const json = await res.json();
      if (json.success) {
        if (activeTab === "overview") { setStats(json.stats); setTotals(json.totals); }
        else if (activeTab === "inventory") setEquipment(json.data);
        else if (activeTab === "staff") setStaff(json.data);
        else if (activeTab === "inquiries") setInquiries(json.data);
        else if (activeTab === "subscribers") setSubscribers(json.data);
        else if (activeTab === "applications") setApplications(json.data);
      } else {
        showToast(json.message || "Failed to load data", "danger");
      }
    } catch (err) { console.error("Fetch error:", err); showToast("Failed to connect to server", "danger"); }
    setLoading(false);
  };

  useEffect(() => { if (!user) navigate("/auth"); fetchData(); }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/update-profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ name: profileData.name, email: profileData.email }),
      });
      const json = await res.json();
      if (json.success) {
        const updatedUser = { ...user, ...json.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        showToast("Profile updated successfully", "success");
      }
    } catch { showToast("Connection error", "danger"); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/api/inquiry/update-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Status updated", "success");
        /* Notify inquiry submitter on meaningful status changes */
        const inquiry = inquiries.find(i => i.id === id);
        if (inquiry?.email && ["COMPLETED", "CANCELLED"].includes(newStatus)) {
          await sendEmailNotification("INQUIRY_STATUS_CHANGE", {
            to: inquiry.email,
            name: inquiry.name,
            status: newStatus,
            inquiryId: id,
          });
        }
        fetchData();
      } else showToast(json.message || "Update failed", "danger");
    } catch (err) { console.error(err); showToast("Update failed", "danger"); }
  };

  /* ── Delete inquiry ── */
  const handleDeleteInquiry = (id) => {
    showConfirm(
      "Delete Inquiry",
      "This inquiry will be permanently removed. This action cannot be undone.",
      async () => {
        setConfirmModal({ show: false });
        setLoading(true);
        try {
          const res = await fetch(`${BASE_URL}/api/inquiry/delete/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });
          const json = await res.json();
          if (json.success) { showToast("Inquiry deleted", "success"); fetchData(); }
          else showToast(json.message || "Delete failed", "danger");
        } catch { showToast("Network error", "danger"); }
        finally { setLoading(false); }
      }
    );
  };

  /* ── Delete application ── */
  const handleDeleteApplication = (id) => {
    showConfirm(
      "Delete Application",
      "This application will be permanently removed. This action cannot be undone.",
      async () => {
        setConfirmModal({ show: false });
        setLoading(true);
        try {
          const res = await fetch(`${BASE_URL}/api/users/applications/delete/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });
          const json = await res.json();
          if (json.success) { showToast("Application deleted", "success"); fetchData(); }
          else showToast(json.message || "Delete failed", "danger");
        } catch { showToast("Network error", "danger"); }
        finally { setLoading(false); }
      }
    );
  };

  /* ── Accept / Reject application ── */
  const handleApplicationDecision = async (item, decision) => {
    const label = decision === "ACCEPTED" ? "accept" : "reject";
    showConfirm(
      `${decision === "ACCEPTED" ? "Accept" : "Reject"} Application`,
      `Are you sure you want to ${label} ${item.applicantName}'s application? An email notification will be sent to the applicant.`,
      async () => {
        setConfirmModal({ show: false });
        setLoading(true);
        try {
          const res = await fetch(`${BASE_URL}/api/users/applications/update-status/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify({ status: decision }),
          });
          const json = await res.json();
          if (res.ok && json.success) {
            showToast(`Application ${decision.toLowerCase()} successfully`, "success");
            /* Email applicant */
            await sendEmailNotification("APPLICATION_DECISION", {
              to: item.applicantEmail,
              name: item.applicantName,
              role: item.roleApplied || item.role,
              decision,
            });
            /* Email admin team */
            await sendEmailNotification("APPLICATION_DECISION_ADMIN", {
              applicantName: item.applicantName,
              role: item.roleApplied || item.role,
              decision,
              decidedBy: user.name,
            });
            if (viewItem?.id === item.id) setViewItem({ ...viewItem, status: decision });
            fetchData();
          } else showToast(json.message || "Update failed", "danger");
        } catch { showToast("Network error", "danger"); }
        finally { setLoading(false); }
      },
      decision === "REJECTED"
    );
  };

  const handleAction = async (type, method, body = null, id = "") => {
    setLoading(true);
    let endpoint = method === "PUT" ? `update/${id}` : "add";
    if (method === "DELETE") endpoint = `delete/${id}`;
    const url = `${BASE_URL}/api/admin/${type}/${endpoint}`;
    try {
      const formData = new FormData();
      if (method !== "DELETE") {
        Object.keys(body).forEach((key) => {
          let value = body[key];
          if (key === "dailyRate" && value) value = parseFloat(value);
          if (value !== null && value !== undefined && value !== "") formData.append(key, value);
        });
        if (selectedFile) formData.append("image", selectedFile);
      }
      const fetchOptions = { method, headers: getAuthHeaders() };
      if (method !== "DELETE") fetchOptions.body = formData;
      const res = await fetch(url, fetchOptions);
      let json;
      try { json = await res.json(); } catch {
        showToast(`Server error (${res.status})`, "danger"); return;
      }
      if (res.status === 401 || json.sessionExpired) {
        localStorage.clear(); window.dispatchEvent(new Event("auth-state-change")); navigate("/auth"); return;
      }
      if (json.success) {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`, "success");
        closeModal(); fetchData();
      } else showToast(json.message || `Operation failed (${res.status})`, "danger");
    } catch (err) { showToast("Network error", "danger"); }
    finally { setLoading(false); }
  };

  const openView = (item) => setViewItem({ ...item, _tab: activeTab });
  const startEdit = (item) => {
    setEditId(item.id);
    const k = activeTab === "inventory" ? "equipment" : "staff";
    setForms({ ...forms, [k]: { ...item } });
    setModals({ ...modals, [k]: true });
  };
  const closeModal = () => {
    setModals({ equipment: false, staff: false }); setEditId(null); setSelectedFile(null);
    setForms({
      equipment: { name: "", category: "Heavy Duty", brand: "", dailyRate: "", region: "Lagos", description: "" },
      staff: { name: "", role: "", specialty: "" },
    });
  };

  const menuItems = [
    { id: "overview",      label: "Overview",         icon: "▦",  roles: ["ADMIN"] },
    { id: "inquiries",     label: user?.role === "CLIENT" ? "My Requests" : "Inquiries", icon: "◎", roles: ["ADMIN","STAFF","CLIENT"] },
    { id: "inventory",     label: "Equipment",        icon: "⬡",  roles: ["ADMIN","STAFF"] },
    { id: "staff",         label: "Personnel",        icon: "◈",  roles: ["ADMIN"] },
    { id: "applications",  label: "Applications",     icon: "◻",  roles: ["ADMIN"] },
    { id: "subscribers",   label: "Subscribers",      icon: "◉",  roles: ["ADMIN","STAFF"] },
    { id: "profile",       label: "My Profile",       icon: "○",  roles: ["ADMIN","STAFF","CLIENT"] },
  ];

  const tableData =
    activeTab === "inventory" ? equipment :
    activeTab === "staff"     ? staff :
    activeTab === "subscribers" ? subscribers :
    activeTab === "applications" ? applications : inquiries;

  const filtered = tableData.filter((item) =>
    (item.name || item.fullName || item.email || item.applicantName || "")
      .toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;
  const initials = user.name.charAt(0).toUpperCase();

  return (
    <Layout>
      <div style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }} className="flex h-screen overflow-hidden bg-[#0C0F1A] text-white relative">

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
          * { box-sizing: border-box; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes toastIn { from { opacity:0; transform:translateY(24px) scale(.94); } to { opacity:1; transform:translateY(0) scale(1); } }
          @keyframes pulse-ring { 0%,100% { box-shadow:0 0 0 0 rgba(99,179,237,0.4); } 50% { box-shadow:0 0 0 8px rgba(99,179,237,0); } }
          .nav-btn { transition: all .2s ease; }
          .nav-btn:hover:not(.active) { background: rgba(255,255,255,0.05); transform: translateX(3px); }
          .nav-btn.active { background: rgba(99,179,237,0.14); color: #63B3ED; }
          .fade-up { animation: fadeUp .35s ease both; }
          .glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); backdrop-filter: blur(12px); }
          .glass-hover { transition: all .2s ease; }
          .glass-hover:hover { background: rgba(255,255,255,0.07); transform: translateY(-2px); }
          .stat-card { position: relative; overflow: hidden; border-radius: 18px; padding: 24px; transition: transform .2s ease, box-shadow .2s ease; }
          .stat-card:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
          .stat-card::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse at top left, var(--accent-bg) 0%, transparent 70%); }
          .btn-primary { background: linear-gradient(135deg,#63B3ED 0%,#4299E1 100%); color: #0C0F1A; font-weight: 700; border-radius: 12px; padding: 12px 24px; border: none; cursor: pointer; transition: all .2s ease; letter-spacing: .3px; }
          .btn-primary:hover { opacity:.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,179,237,.35); }
          .btn-primary:disabled { opacity:.4; transform: none; }
          .btn-danger-solid { background: linear-gradient(135deg,#FC8181,#E53E3E); color: white; font-weight: 700; border-radius: 12px; padding: 12px 24px; border: none; cursor: pointer; transition: all .2s ease; }
          .btn-danger-solid:hover { opacity:.9; transform: translateY(-1px); }
          .btn-ghost { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); font-weight: 600; border-radius: 12px; padding: 12px 24px; cursor: pointer; transition: all .2s ease; }
          .btn-ghost:hover { background: rgba(255,255,255,0.1); }
          .input-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; color: white; font-size: 14px; font-family: inherit; outline: none; transition: all .2s ease; }
          .input-field::placeholder { color: rgba(255,255,255,.3); }
          .input-field:focus { border-color: #63B3ED; box-shadow: 0 0 0 3px rgba(99,179,237,.15); }
          .select-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; color: white; font-size: 14px; font-family: inherit; outline: none; cursor: pointer; transition: all .2s ease; appearance: none; }
          .select-field:focus { border-color: #63B3ED; box-shadow: 0 0 0 3px rgba(99,179,237,.15); }
          .select-field option { background: #1A1F35; }
          .status-pill { font-size: 10px; font-weight: 700; letter-spacing: .8px; padding: 4px 10px; border-radius: 99px; text-transform: uppercase; }
          .table-row { transition: background .15s ease; }
          .table-row:hover { background: rgba(255,255,255,0.03); }
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
          .modal-box { background: #131726; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 36px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: fadeUp .25s ease; }
          .label-text { font-size: 11px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 8px; display: block; }
          .btn-view { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.6); background: rgba(255,255,255,.06); border: none; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-family: inherit; transition: all .2s; }
          .btn-view:hover { background: rgba(255,255,255,.12); }
          .btn-accept { font-size: 12px; font-weight: 700; color: #10B981; background: rgba(16,185,129,.1); border: none; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-family: inherit; transition: all .2s; }
          .btn-accept:hover { background: rgba(16,185,129,.2); }
          .btn-reject { font-size: 12px; font-weight: 700; color: #FC8181; background: rgba(252,129,129,.1); border: none; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-family: inherit; transition: all .2s; }
          .btn-reject:hover { background: rgba(252,129,129,.2); }
          .btn-delete { font-size: 12px; font-weight: 700; color: #FC8181; background: rgba(252,129,129,.1); border: none; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-family: inherit; transition: all .2s; }
          .btn-delete:hover { background: rgba(252,129,129,.2); }
        `}</style>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)" }}
            onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* ════ SIDEBAR ════ */}
        <aside style={{ width: 260, background: "#0E1120", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", zIndex: 50, transition: "transform .3s ease" }}
          className={`fixed lg:static inset-y-0 left-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "linear-gradient(135deg,#63B3ED,#4299E1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 20, color: "#0C0F1A", boxShadow: "0 8px 20px rgba(99,179,237,.3)" }}>C</div>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "-.3px" }}>Crystal</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 500, marginTop: 1 }}>Industrial Portal</div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden" style={{ marginLeft: "auto", color: "rgba(255,255,255,.4)", fontSize: 20, background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
          </div>

          <div style={{ padding: "20px 16px 12px" }}>
            <div className="glass" style={{ borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#63B3ED,#4299E1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 18, color: "#0C0F1A" }}>{initials}</div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 500, marginTop: 2, letterSpacing: ".4px" }}>{user.role}</div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "4px 12px", overflowY: "auto" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "rgba(255,255,255,.25)", padding: "8px 8px 6px", textTransform: "uppercase" }}>Navigation</div>
            {menuItems.filter(m => m.roles.includes(user.role)).map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", borderRadius: 12, background: "none", border: "none", cursor: "pointer", color: activeTab === item.id ? "#63B3ED" : "rgba(255,255,255,.55)", fontSize: 13.5, fontWeight: activeTab === item.id ? 700 : 500, textAlign: "left", marginBottom: 2, fontFamily: "inherit" }}>
                <span style={{ fontSize: 16, opacity: .9 }}>{item.icon}</span>
                <span>{item.label}</span>
                {activeTab === item.id && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#63B3ED", boxShadow: "0 0 8px #63B3ED" }} />}
              </button>
            ))}
          </nav>

          <div style={{ padding: "12px 12px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={() => { localStorage.clear(); navigate("/auth"); }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", borderRadius: 12, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.35)", fontSize: 13.5, fontWeight: 500, fontFamily: "inherit", transition: "color .2s ease" }}
              onMouseEnter={e => e.currentTarget.style.color = "#FC8181"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.35)"}>
              <span style={{ fontSize: 16 }}>⎋</span><span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <header style={{ height: 72, background: "rgba(12,15,26,.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "8px 10px", cursor: "pointer", color: "rgba(255,255,255,.7)" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-.4px", lineHeight: 1 }}>
                  {activeTab === "inventory" ? "Equipment" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", fontWeight: 500, marginTop: 3 }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#63B3ED", fontWeight: 600 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#63B3ED", animation: "pulse-ring 1.4s ease infinite" }} />Syncing…
                </div>
              )}
              <div style={{ background: "rgba(99,179,237,.12)", border: "1px solid rgba(99,179,237,.25)", borderRadius: 99, padding: "6px 14px", fontSize: 11, fontWeight: 700, letterSpacing: ".8px", color: "#63B3ED" }}>{user.role}</div>
            </div>
          </header>

          <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <div className="fade-up" style={{ maxWidth: 680, margin: "0 auto" }}>
                <div className="glass" style={{ borderRadius: 24, padding: 36 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ width: 88, height: 88, borderRadius: 24, flexShrink: 0, background: "linear-gradient(135deg,#63B3ED,#4299E1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 36, color: "#0C0F1A", boxShadow: "0 12px 30px rgba(99,179,237,.3)" }}>{initials}</div>
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px", lineHeight: 1.1 }}>{user.name}</div>
                      <div style={{ color: "rgba(255,255,255,.45)", fontSize: 13, marginTop: 6 }}>{user.role} · {user.email}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        {["Active","Verified"].map(t => <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: "rgba(99,179,237,.14)", color: "#63B3ED", letterSpacing: ".4px" }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleUpdateProfile}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <div>
                        <label className="label-text">Full Name</label>
                        <input className="input-field" type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="label-text">Email Address</label>
                        <input className="input-field" type="email" value={profileData.email} disabled style={{ opacity: .4, cursor: "not-allowed" }} />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: 8, padding: "15px 24px" }}>
                      {loading ? "Saving…" : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && user.role === "ADMIN" && (
              <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16 }}>
                  {Object.entries(stats).map(([key, value]) => {
                    const m = statMeta[key] || { icon: "◉", label: key, bg: "rgba(255,255,255,.05)", accent: "#fff" };
                    return (
                      <div key={key} className="stat-card glass-hover glass" style={{ "--accent-bg": m.bg }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, position: "relative", zIndex: 1 }}>
                          <span style={{ fontSize: 22 }}>{m.icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".7px", color: m.accent, background: `rgba(${m.accent === "#F59E0B" ? "245,158,11" : m.accent === "#3B82F6" ? "59,130,246" : m.accent === "#10B981" ? "16,185,129" : "239,68,68"},.15)`, padding: "3px 10px", borderRadius: 99 }}>{m.label}</span>
                        </div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 40, lineHeight: 1, position: "relative", zIndex: 1 }}>{value}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 6, position: "relative", zIndex: 1 }}>Total inquiries</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ borderRadius: 22, padding: 32, background: "linear-gradient(135deg,#63B3ED 0%,#4299E1 100%)", color: "#0C0F1A", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />
                    <div style={{ position: "absolute", right: 30, bottom: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".8px", opacity: .7, marginBottom: 8 }}>FLEET ASSETS</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 64, lineHeight: 1 }}>{totals.equipment}</div>
                      <div style={{ fontSize: 13, opacity: .7, marginTop: 10 }}>Equipment in inventory</div>
                    </div>
                  </div>
                  <div className="glass" style={{ borderRadius: 22, padding: 32, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(99,179,237,.06)" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".8px", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>PERSONNEL</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 64, lineHeight: 1 }}>{totals.staff}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginTop: 10 }}>Active staff members</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TABLES ── */}
            {["inquiries","inventory","staff","subscribers","applications"].includes(activeTab) && (
              <div className="fade-up glass" style={{ borderRadius: 22, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-.3px" }}>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.3)" }}>{filtered.length} records</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ position: "relative" }}>
                      <input className="input-field" placeholder="Search…" style={{ width: 220, paddingLeft: 38 }} onChange={e => setSearch(e.target.value)} />
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(255,255,255,.3)" }}>⌕</span>
                    </div>
                    {["inventory","staff"].includes(activeTab) && (
                      <button className="btn-primary"
                        onClick={() => { setEditId(null); setSelectedFile(null); setForms({ equipment: { name:"",category:"Heavy Duty",brand:"",dailyRate:"",region:"Lagos",description:"" }, staff: { name:"",role:"",specialty:"" } }); setModals({ ...modals, [activeTab === "inventory" ? "equipment" : "staff"]: true }); }}
                        style={{ padding: "10px 20px", fontSize: 13 }}>+ Add New</button>
                    )}
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        {[
                          activeTab === "subscribers" ? "Email" : activeTab === "applications" ? "Applicant" : "Name",
                          activeTab === "subscribers" ? "Date" : activeTab === "applications" ? "Role / Status" : "Details",
                          "Actions"
                        ].map((h, i) => (
                          <th key={h} style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, letterSpacing: ".8px", color: "rgba(255,255,255,.3)", textAlign: i === 2 ? "right" : "left", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={3} style={{ textAlign: "center", padding: "48px 20px", color: "rgba(255,255,255,.25)", fontSize: 14 }}>No records found</td></tr>
                      ) : filtered.map(item => (
                        <tr key={item.id} className="table-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(255,255,255,.1)", flexShrink: 0 }} />
                              ) : (
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,179,237,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                                  {activeTab === "staff" ? "◈" : activeTab === "inventory" ? "⬡" : activeTab === "applications" ? "◻" : "◎"}
                                </div>
                              )}
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>
                                  {activeTab === "applications" ? item.applicantName : activeTab === "subscribers" ? item.email : item.name || item.fullName}
                                </div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 2 }}>
                                  {activeTab === "applications" ? item.applicantEmail : item.brand || item.email || item.specialty}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            {activeTab === "applications" ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>{item.roleApplied || item.role || "—"}</span>
                                {item.status && (
                                  <span className="status-pill" style={{ background: `${statusColor(item.status)}22`, color: statusColor(item.status), width: "fit-content" }}>{item.status}</span>
                                )}
                              </div>
                            ) : item.status ? (
                              <span className="status-pill" style={{ background: `${statusColor(item.status)}22`, color: statusColor(item.status) }}>{item.status}</span>
                            ) : (
                              <span style={{ fontSize: 13, color: "rgba(255,255,255,.45)" }}>
                                {item.category || item.role || item.roleApplied || new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "14px 20px", textAlign: "right" }}>
                            {/* ── INQUIRIES ACTIONS ── */}
                            {activeTab === "inquiries" && (
                              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <button className="btn-view" onClick={() => openView(item)}>View</button>
                                <select value={item.status} onChange={e => handleStatusUpdate(item.id, e.target.value)} className="select-field"
                                  style={{ width: "auto", padding: "6px 32px 6px 12px", fontSize: 12 }}>
                                  <option value="PENDING">PENDING</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </select>
                                <button className="btn-delete" onClick={() => handleDeleteInquiry(item.id)}>Delete</button>
                              </div>
                            )}

                            {/* ── SUBSCRIBERS ACTIONS ── */}
                            {activeTab === "subscribers" && (
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,.2)", fontWeight: 600, letterSpacing: ".5px" }}>SYSTEM</span>
                            )}

                            {/* ── INVENTORY / STAFF ACTIONS ── */}
                            {["inventory","staff"].includes(activeTab) && (
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                <button className="btn-view" onClick={() => openView(item)}>View</button>
                                <button onClick={() => startEdit(item)} style={{ fontSize: 12, fontWeight: 700, color: "#63B3ED", background: "rgba(99,179,237,.1)", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(99,179,237,.2)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "rgba(99,179,237,.1)"}>Edit</button>
                                <button onClick={() => handleAction(activeTab === "inventory" ? "equipment" : "staff", "DELETE", null, item.id)}
                                  style={{ fontSize: 12, fontWeight: 700, color: "#FC8181", background: "rgba(252,129,129,.1)", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(252,129,129,.2)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "rgba(252,129,129,.1)"}>Delete</button>
                              </div>
                            )}

                            {/* ── APPLICATIONS ACTIONS ── */}
                            {activeTab === "applications" && (
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
                                <button className="btn-view" onClick={() => openView(item)}>View</button>
                                {(!item.status || item.status === "PENDING") && (
                                  <>
                                    <button className="btn-accept" onClick={() => handleApplicationDecision(item, "ACCEPTED")}>Accept</button>
                                    <button className="btn-reject" onClick={() => handleApplicationDecision(item, "REJECTED")}>Reject</button>
                                  </>
                                )}
                                <button className="btn-delete" onClick={() => handleDeleteApplication(item.id)}>Delete</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── TOAST ── */}
        {toast.show && (
          <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 300, padding: "14px 22px", borderRadius: 14, fontWeight: 700, fontSize: 13, letterSpacing: ".3px", animation: "toastIn .3s ease", background: toast.type === "danger" ? "linear-gradient(135deg,#FC8181,#E53E3E)" : toast.type === "success" ? "linear-gradient(135deg,#68D391,#38A169)" : "linear-gradient(135deg,#63B3ED,#4299E1)", color: toast.type === "info" ? "#0C0F1A" : "white", boxShadow: "0 12px 30px rgba(0,0,0,.4)" }}>
            {toast.message}
          </div>
        )}
      </div>

      {/* ════ CONFIRM MODAL ════ */}
      {confirmModal.show && (
        <div className="modal-overlay" onClick={() => setConfirmModal({ show: false })}>
          <div className="modal-box" style={{ maxWidth: 440, padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: confirmModal.danger ? "rgba(252,129,129,.12)" : "rgba(99,179,237,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {confirmModal.danger ? "⚠️" : "ℹ️"}
              </div>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-.3px" }}>{confirmModal.title}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.65, marginBottom: 28 }}>{confirmModal.message}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className={confirmModal.danger ? "btn-danger-solid" : "btn-primary"} style={{ flex: 1, padding: "13px 24px", fontFamily: "inherit" }} onClick={confirmModal.onConfirm}>
                Confirm
              </button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmModal({ show: false })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ EQUIPMENT MODAL ════ */}
      {modals.equipment && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 24, letterSpacing: "-.4px" }}>{editId ? "Update" : "Add"} Equipment</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label-text">Equipment Name *</label>
                <input className="input-field" placeholder="e.g., Caterpillar 320D Excavator" value={forms.equipment.name}
                  onChange={e => setForms({ ...forms, equipment: { ...forms.equipment, name: e.target.value } })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="label-text">Category *</label>
                  <select className="select-field" value={forms.equipment.category} onChange={e => setForms({ ...forms, equipment: { ...forms.equipment, category: e.target.value } })}>
                    <option>Heavy Duty</option><option>Oil &amp; Gas</option><option>Energy</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">Brand</label>
                  <input className="input-field" placeholder="Caterpillar" value={forms.equipment.brand} onChange={e => setForms({ ...forms, equipment: { ...forms.equipment, brand: e.target.value } })} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="label-text">Region</label>
                  <input className="input-field" placeholder="Lagos" value={forms.equipment.region} onChange={e => setForms({ ...forms, equipment: { ...forms.equipment, region: e.target.value } })} />
                </div>
                <div>
                  <label className="label-text">Daily Rate (₦)</label>
                  <input className="input-field" type="number" placeholder="150000" value={forms.equipment.dailyRate} onChange={e => setForms({ ...forms, equipment: { ...forms.equipment, dailyRate: e.target.value } })} />
                </div>
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea className="input-field" placeholder="Equipment specifications…" rows={3} style={{ resize: "none" }} value={forms.equipment.description || ""}
                  onChange={e => setForms({ ...forms, equipment: { ...forms.equipment, description: e.target.value } })} />
              </div>
              <div style={{ border: "1px dashed rgba(255,255,255,.15)", borderRadius: 14, padding: 20, background: "rgba(255,255,255,.02)" }}>
                <label className="label-text">Equipment Photo</label>
                {editId && forms.equipment.imageUrl && !selectedFile && (
                  <div style={{ marginBottom: 12 }}>
                    <img src={forms.equipment.imageUrl} alt="Current" style={{ height: 120, width: "100%", objectFit: "cover", borderRadius: 10 }} />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 6 }}>Current image</div>
                  </div>
                )}
                {selectedFile && (
                  <div style={{ marginBottom: 12 }}>
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ height: 120, width: "100%", objectFit: "cover", borderRadius: 10 }} />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 6 }}>New image preview</div>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])} style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }} />
              </div>
              <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                <button className="btn-primary" style={{ flex: 1, padding: "15px 24px" }} disabled={loading}
                  onClick={() => handleAction("equipment", editId ? "PUT" : "POST", forms.equipment, editId)}>
                  {loading ? "Saving…" : editId ? "Update Equipment" : "Add Equipment"}
                </button>
                <button className="btn-ghost" style={{ flex: 1 }} disabled={loading} onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ STAFF MODAL ════ */}
      {modals.staff && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 480 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 24, letterSpacing: "-.4px" }}>{editId ? "Update" : "Add"} Staff Member</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Staff Name *", key: "name", placeholder: "John Doe" },
                { label: "Role", key: "role", placeholder: "Engineer" },
                { label: "Specialty", key: "specialty", placeholder: "Mechanical" },
              ].map(f => (
                <div key={f.key}>
                  <label className="label-text">{f.label}</label>
                  <input className="input-field" placeholder={f.placeholder} value={forms.staff[f.key]} onChange={e => setForms({ ...forms, staff: { ...forms.staff, [f.key]: e.target.value } })} />
                </div>
              ))}
              <div style={{ border: "1px dashed rgba(255,255,255,.15)", borderRadius: 14, padding: 20, background: "rgba(255,255,255,.02)" }}>
                <label className="label-text">Staff Photo</label>
                <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])} style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }} />
              </div>
              <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                <button className="btn-primary" style={{ flex: 1, padding: "15px 24px" }} disabled={loading}
                  onClick={() => handleAction("staff", editId ? "PUT" : "POST", forms.staff, editId)}>
                  {loading ? "Saving…" : editId ? "Update Staff" : "Add Staff"}
                </button>
                <button className="btn-ghost" style={{ flex: 1 }} disabled={loading} onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ VIEW DETAIL MODAL ════ */}
      {viewItem && (
        <div className="modal-overlay" onClick={() => setViewItem(null)}>
          <div className="modal-box" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".8px", color: "rgba(255,255,255,.35)", textTransform: "uppercase", marginBottom: 6 }}>
                  {viewItem._tab === "inventory" ? "Equipment" : viewItem._tab === "staff" ? "Staff Member" : viewItem._tab === "inquiries" ? "Inquiry" : viewItem._tab === "applications" ? "Application" : "Record"}
                </div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-.4px", margin: 0 }}>
                  {viewItem.name || viewItem.applicantName || viewItem.fullName || "—"}
                </h2>
              </div>
              <button onClick={() => setViewItem(null)} style={{ background: "rgba(255,255,255,.08)", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", color: "rgba(255,255,255,.6)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
            </div>

            {viewItem.imageUrl && (
              <div style={{ marginBottom: 24 }}>
                <img src={viewItem.imageUrl} alt="" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 14, border: "1px solid rgba(255,255,255,.1)" }} />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {viewItem._tab === "inventory" && (
                [
                  { label: "Category",    value: viewItem.category },
                  { label: "Brand",       value: viewItem.brand },
                  { label: "Region",      value: viewItem.region },
                  { label: "Daily Rate",  value: viewItem.dailyRate ? `₦${Number(viewItem.dailyRate).toLocaleString()}` : null },
                  { label: "Description", value: viewItem.description },
                  { label: "Added",       value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null },
                ].map(({ label, value }) => value ? (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".6px", color: "rgba(255,255,255,.35)", textTransform: "uppercase", flexShrink: 0, marginRight: 16 }}>{label}</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,.85)", textAlign: "right", lineHeight: 1.5 }}>{value}</span>
                  </div>
                ) : null)
              )}

              {viewItem._tab === "staff" && (
                [
                  { label: "Role",      value: viewItem.role },
                  { label: "Specialty", value: viewItem.specialty },
                  { label: "Added",     value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null },
                ].map(({ label, value }) => value ? (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".6px", color: "rgba(255,255,255,.35)", textTransform: "uppercase", flexShrink: 0, marginRight: 16 }}>{label}</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,.85)", textAlign: "right" }}>{value}</span>
                  </div>
                ) : null)
              )}

              {viewItem._tab === "inquiries" && (
                [
                  { label: "Email",     value: viewItem.email },
                  { label: "Phone",     value: viewItem.phone },
                  { label: "Company",   value: viewItem.company },
                  { label: "Equipment", value: viewItem.equipmentType || viewItem.equipment },
                  { label: "Message",   value: viewItem.message },
                  { label: "Status",    value: viewItem.status, isStatus: true },
                  { label: "Submitted", value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null },
                ].map(({ label, value, isStatus }) => value ? (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".6px", color: "rgba(255,255,255,.35)", textTransform: "uppercase", flexShrink: 0, marginRight: 16 }}>{label}</span>
                    {isStatus ? <span className="status-pill" style={{ background: `${statusColor(value)}22`, color: statusColor(value) }}>{value}</span>
                      : <span style={{ fontSize: 14, color: "rgba(255,255,255,.85)", textAlign: "right", maxWidth: "65%", lineHeight: 1.5 }}>{value}</span>}
                  </div>
                ) : null)
              )}

              {viewItem._tab === "applications" && (
                <>
                  {[
                    { label: "Applicant",    value: viewItem.applicantName },
                    { label: "Email",        value: viewItem.applicantEmail },
                    { label: "Phone",        value: viewItem.applicantPhone || viewItem.phone },
                    { label: "Role Applied", value: viewItem.roleApplied || viewItem.role },
                    { label: "Experience",   value: viewItem.experience },
                    { label: "Cover Letter", value: viewItem.coverLetter || viewItem.message },
                    { label: "Status",       value: viewItem.status, isStatus: true },
                    { label: "Submitted",    value: viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null },
                  ].map(({ label, value, isStatus }) => value ? (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".6px", color: "rgba(255,255,255,.35)", textTransform: "uppercase", flexShrink: 0, marginRight: 16 }}>{label}</span>
                      {isStatus ? <span className="status-pill" style={{ background: `${statusColor(value)}22`, color: statusColor(value) }}>{value}</span>
                        : <span style={{ fontSize: 14, color: "rgba(255,255,255,.85)", textAlign: "right", maxWidth: "65%", lineHeight: 1.5 }}>{value}</span>}
                    </div>
                  ) : null)}
                </>
              )}
            </div>

            {/* Bottom buttons */}
            {viewItem._tab === "applications" ? (
              <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                {(!viewItem.status || viewItem.status === "PENDING") && (
                  <>
                    <button className="btn-accept" style={{ flex: 1, padding: "13px 24px", fontSize: 14, borderRadius: 12 }}
                      onClick={() => handleApplicationDecision(viewItem, "ACCEPTED")}>Accept Applicant</button>
                    <button className="btn-reject" style={{ flex: 1, padding: "13px 24px", fontSize: 14, borderRadius: 12 }}
                      onClick={() => handleApplicationDecision(viewItem, "REJECTED")}>Reject Applicant</button>
                  </>
                )}
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setViewItem(null)}>Close</button>
              </div>
            ) : ["inventory","staff"].includes(viewItem._tab) ? (
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="btn-primary" style={{ flex: 1, padding: "13px 24px" }} onClick={() => { setViewItem(null); startEdit(viewItem); }}>Edit this record</button>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setViewItem(null)}>Close</button>
              </div>
            ) : (
              <button className="btn-primary" style={{ width: "100%", marginTop: 24, padding: "13px 24px" }} onClick={() => setViewItem(null)}>Close</button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;