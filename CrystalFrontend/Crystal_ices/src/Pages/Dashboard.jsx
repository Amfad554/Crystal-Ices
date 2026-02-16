import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";

const BASE_URL = "https://crystalbackend.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // --- DATA STATES ---
  const [stats, setStats] = useState({ PENDING: 0, PROCESSING: 0, COMPLETED: 0, CANCELLED: 0 });
  const [totals, setTotals] = useState({ equipment: 0, staff: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [staff, setStaff] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  // --- PROFILE STATE ---
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "System User",
  });

  // --- MODALS ---
  const [modals, setModals] = useState({ equipment: false, staff: false });
  const [forms, setForms] = useState({
    equipment: { name: "", category: "Heavy Duty", brand: "", dailyRate: "", region: "Lagos", description: "" },
    staff: { name: "", role: "", specialty: "" },
  });

  const showToast = (msg, type = "info") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    return {
      'Authorization': `Bearer ${token}`,
      'x-login-time': loginTime || Date.now().toString()
    };
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

      const res = await fetch(`${BASE_URL}/${endpoints[activeTab]}`);
      const json = await res.json();

      if (json.success) {
        if (activeTab === "overview") {
          setStats(json.stats);
          setTotals(json.totals);
        } else if (activeTab === "inventory") setEquipment(json.data);
        else if (activeTab === "staff") setStaff(json.data);
        else if (activeTab === "inquiries") setInquiries(json.data);
        else if (activeTab === "subscribers") setSubscribers(json.data);
        else if (activeTab === "applications") setApplications(json.data);
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to sync with database", "danger");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) navigate("/auth");
    fetchData();
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/update-profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileData.name, email: profileData.email }),
      });
      const json = await res.json();
      if (json.success) {
        const updatedUser = { ...user, ...json.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        showToast("Profile updated successfully", "success");
      }
    } catch (err) {
      console.log(err);
      showToast("Connection error", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/api/inquiry/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast("Status updated");
        fetchData();
      }
    } catch (err) {
      console.log(err);
      showToast("Update failed", "danger");
    }
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
          if (value !== null && value !== undefined && value !== "") {
            formData.append(key, value);
          }
        });
        if (selectedFile) formData.append("image", selectedFile);
      }

      // Get auth headers
      const headers = getAuthHeaders();

      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: method === "DELETE" ? null : formData,
      });

      const json = await res.json();

      // Handle session expiration
      if (!res.ok && (json.sessionExpired || res.status === 401)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        window.dispatchEvent(new Event('auth-state-change'));
        alert('Your session has expired. Please login again.');
        navigate('/auth');
        return;
      }

      if (json.success) {
        showToast(`${type} updated successfully!`, "success");
        closeModal();
        fetchData();
      } else {
        showToast(json.message || "Operation failed", "danger");
      }
    } catch (err) {
      console.error("Save Error:", err);
      showToast("Server error", "danger");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    const targetKey = activeTab === "inventory" ? "equipment" : "staff";
    setForms({ ...forms, [targetKey]: { ...item } });
    setModals({ ...modals, [targetKey]: true });
  };

  const closeModal = () => {
    setModals({ equipment: false, staff: false });
    setEditId(null);
    setSelectedFile(null);
    setForms({
      equipment: { name: "", category: "Heavy Duty", brand: "", dailyRate: "", region: "Lagos", description: "" },
      staff: { name: "", role: "", specialty: "" },
    });
  };

  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: "📊",
      roles: ["ADMIN"],
    },
    {
      id: "inquiries",
      label: user?.role === "CLIENT" ? "My Requests" : "Inquiries",
      icon: "💬",
      roles: ["ADMIN", "STAFF", "CLIENT"],
    },
    {
      id: "inventory",
      label: "Equipment",
      icon: "🚜",
      roles: ["ADMIN", "STAFF"],
    },
    {
      id: "staff",
      label: "Personnel",
      icon: "👥",
      roles: ["ADMIN"],
    },
    {
      id: "applications",
      label: "Job Applications",
      icon: "📄",
      roles: ["ADMIN"],
    },
    {
      id: "subscribers",
      label: "Subscribers",
      icon: "📧",
      roles: ["ADMIN", "STAFF"],
    },
    {
      id: "profile",
      label: "My Profile",
      icon: "👤",
      roles: ["ADMIN", "STAFF", "CLIENT"],
    },
  ];

  if (!user) return null;

  return (
    <Layout>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 font-['Inter'] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #0B2A4A 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0B2A4A] to-[#051526] text-white flex flex-col shadow-2xl transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00A3A3] to-[#00C9C9] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#00A3A3]/20">
                  C
                </div>
                <div>
                  <h1 className="font-black text-lg tracking-tight">Crystal</h1>
                  <p className="text-xs text-white/60">Industrial Portal</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="px-6 pt-6 pb-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A3A3] to-[#00C9C9] flex items-center justify-center font-black text-xl shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{user.name}</h3>
                  <p className="text-xs text-white/60">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 overflow-y-auto">
            <div className="space-y-1">
              {menuItems
                .filter((item) => item.roles.includes(user.role))
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                        ? "bg-gradient-to-r from-[#00A3A3] to-[#00C9C9] text-white shadow-lg shadow-[#00A3A3]/20"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/auth");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          {/* Top Bar */}
          <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-black text-[#0B2A4A] tracking-tight capitalize">
                  {activeTab === "inventory" ? "Equipment" : activeTab}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00A3A3] to-[#00C9C9] rounded-full">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">{user.role}</span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#00A3A3] to-[#00C9C9] rounded-3xl flex items-center justify-center text-5xl text-white font-black shadow-2xl shadow-[#00A3A3]/20">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-black text-[#0B2A4A] mb-2">{user.name}</h3>
                      <p className="text-slate-500 font-medium">{user.role} • {user.email}</p>
                      <div className="mt-4 flex gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Active</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Verified</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#00A3A3] to-[#00C9C9] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#00A3A3]/20 hover:shadow-xl hover:shadow-[#00A3A3]/30 transition-all disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* OVERVIEW TAB - ADMIN ONLY */}
            {activeTab === "overview" && user.role === "ADMIN" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all"
                    >
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{key}</p>
                      <p className="text-4xl font-black text-[#0B2A4A]">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Large Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-[#00A3A3] to-[#00C9C9] rounded-3xl p-8 text-white shadow-2xl shadow-[#00A3A3]/20">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-wider mb-2">Fleet Assets</p>
                    <p className="text-6xl font-black mb-4">{totals.equipment}</p>
                    <p className="text-sm opacity-80">Total equipment in inventory</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#0B2A4A] to-[#051526] rounded-3xl p-8 text-white shadow-2xl">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-wider mb-2">Personnel</p>
                    <p className="text-6xl font-black mb-4">{totals.staff}</p>
                    <p className="text-sm opacity-80">Active staff members</p>
                  </div>
                </div>
              </div>
            )}

            {/* DATA TABLES */}
            {["inquiries", "inventory", "staff", "subscribers", "applications"].includes(activeTab) && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <h3 className="text-2xl font-black text-[#0B2A4A]">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h3>
                  <div className="flex w-full sm:w-auto gap-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="flex-1 sm:w-64 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {["inventory", "staff"].includes(activeTab) && (
                      <button
                        onClick={() => {
                          setEditId(null);
                          setSelectedFile(null);
                          setForms({
                            equipment: { name: "", category: "Heavy Duty", brand: "", dailyRate: "", region: "Lagos", description: "" },
                            staff: { name: "", role: "", specialty: "" },
                          });
                          setModals({ ...modals, [activeTab === "inventory" ? "equipment" : "staff"]: true });
                        }}
                        className="bg-gradient-to-r from-[#00A3A3] to-[#00C9C9] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                      >
                        + Add New
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {activeTab === "subscribers" ? "Email" : activeTab === "applications" ? "Applicant" : "Name"}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {activeTab === "subscribers" ? "Date" : activeTab === "applications" ? "Role" : "Details"}
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(activeTab === "inventory" ? equipment :
                        activeTab === "staff" ? staff :
                          activeTab === "subscribers" ? subscribers :
                            activeTab === "applications" ? applications : inquiries)
                        .filter((item) =>
                          (item.name || item.fullName || item.email || item.applicantName || "")
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        )
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {item.imageUrl && (
                                  <img
                                    src={item.imageUrl}
                                    alt=""
                                    className="w-12 h-12 rounded-xl object-cover border-2 border-slate-200"
                                  />
                                )}
                                <div>
                                  <div className="font-bold text-slate-900">
                                    {activeTab === "applications" ? item.applicantName :
                                      activeTab === "subscribers" ? item.email :
                                        item.name || item.fullName}
                                  </div>
                                  <div className="text-sm text-slate-500">
                                    {activeTab === "applications" ? item.applicantEmail :
                                      item.brand || item.email || item.specialty}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-600">
                                {item.category || item.role || item.roleApplied || new Date(item.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {activeTab === "inquiries" ? (
                                <select
                                  value={item.status}
                                  onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                                  className="text-xs font-bold px-3 py-2 rounded-lg border-2 border-slate-200 bg-white outline-none focus:border-[#00A3A3] transition-all"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </select>
                              ) : activeTab === "subscribers" ? (
                                <span className="text-xs text-slate-400 font-medium uppercase">System Record</span>
                              ) : (
                                <div className="flex justify-end items-center gap-3">
                                  {["inventory", "staff"].includes(activeTab) && (
                                    <>
                                      <button
                                        onClick={() => startEdit(item)}
                                        className="text-[#00A3A3] font-bold text-xs hover:text-[#00C9C9] transition-colors uppercase"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleAction(
                                          activeTab === "inventory" ? "equipment" : "staff",
                                          "DELETE",
                                          null,
                                          item.id
                                        )}
                                        className="text-red-500 font-bold text-xs hover:text-red-700 transition-colors uppercase"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
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

        {/* Toast Notifications */}
        {toast.show && (
          <div
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm uppercase z-[100] animate-slide-up ${toast.type === "danger" ? "bg-gradient-to-r from-red-500 to-red-600" :
                toast.type === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                  "bg-gradient-to-r from-[#0B2A4A] to-[#051526]"
              }`}
          >
            {toast.message}
          </div>
        )}
      </div>

      {/* EQUIPMENT MODAL */}
      {modals.equipment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black mb-6 text-[#0B2A4A]">
              {editId ? "Update" : "Add"} Equipment
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Equipment Name *
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                  placeholder="e.g., Caterpillar 320D Excavator"
                  value={forms.equipment.name}
                  onChange={(e) => setForms({ ...forms, equipment: { ...forms.equipment, name: e.target.value } })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                    value={forms.equipment.category}
                    onChange={(e) => setForms({ ...forms, equipment: { ...forms.equipment, category: e.target.value } })}
                  >
                    <option value="Heavy Duty">Heavy Duty</option>
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Energy">Energy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Brand
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                    placeholder="Caterpillar"
                    value={forms.equipment.brand}
                    onChange={(e) => setForms({ ...forms, equipment: { ...forms.equipment, brand: e.target.value } })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Region
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                    placeholder="Lagos"
                    value={forms.equipment.region}
                    onChange={(e) => setForms({ ...forms, equipment: { ...forms.equipment, region: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Daily Rate (₦)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                    placeholder="150000"
                    value={forms.equipment.dailyRate}
                    onChange={(e) => setForms({ ...forms, equipment: { ...forms.equipment, dailyRate: e.target.value } })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all resize-none"
                  placeholder="Equipment specifications..."
                  rows="3"
                  value={forms.equipment.description || ""}
                  onChange={(e) => setForms({ ...forms, equipment: { ...forms.equipment, description: e.target.value } })}
                />
              </div>

              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  Equipment Photo
                </label>
                {editId && forms.equipment.imageUrl && !selectedFile && (
                  <div className="mb-4">
                    <img src={forms.equipment.imageUrl} alt="Current" className="h-40 w-full object-cover rounded-xl" />
                    <p className="text-xs text-slate-400 mt-2">Current image</p>
                  </div>
                )}
                {selectedFile && (
                  <div className="mb-4">
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-40 w-full object-cover rounded-xl" />
                    <p className="text-xs text-slate-400 mt-2">New image preview</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#00A3A3] file:to-[#00C9C9] file:text-white hover:file:shadow-lg cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleAction("equipment", editId ? "PUT" : "POST", forms.equipment, editId)}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#00A3A3] to-[#00C9C9] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : editId ? "Update" : "Add Equipment"}
                </button>
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 py-4 font-bold text-slate-600 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAFF MODAL */}
      {modals.staff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <h2 className="text-3xl font-black mb-6 text-[#0B2A4A]">
              {editId ? "Update" : "Add"} Staff Member
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Staff Name *
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                  placeholder="John Doe"
                  value={forms.staff.name}
                  onChange={(e) => setForms({ ...forms, staff: { ...forms.staff, name: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Role
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                  placeholder="Engineer"
                  value={forms.staff.role}
                  onChange={(e) => setForms({ ...forms, staff: { ...forms.staff, role: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Specialty
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00A3A3] focus:ring-4 focus:ring-[#00A3A3]/10 transition-all"
                  placeholder="Mechanical"
                  value={forms.staff.specialty}
                  onChange={(e) => setForms({ ...forms, staff: { ...forms.staff, specialty: e.target.value } })}
                />
              </div>

              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  Staff Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#00A3A3] file:to-[#00C9C9] file:text-white hover:file:shadow-lg cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleAction("staff", editId ? "PUT" : "POST", forms.staff, editId)}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#00A3A3] to-[#00C9C9] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : editId ? "Update" : "Add Staff"}
                </button>
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 py-4 font-bold text-slate-600 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;