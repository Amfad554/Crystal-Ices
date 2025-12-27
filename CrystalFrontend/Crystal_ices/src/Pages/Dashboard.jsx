import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";

// --- CENTRALIZED API CONFIG ---
const BASE_URL = "https://crystalbackend.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // --- DATA STATES ---
  const [stats, setStats] = useState({
    PENDING: 0,
    PROCESSING: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  });
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
    equipment: {
      name: "",
      category: "Heavy Duty",
      brand: "",
      dailyRate: "",
      region: "Lagos",
    },
    staff: { name: "", role: "", specialty: "" },
  });

  const showToast = (msg, type = "info") => {
    setToast({ show: true, message: msg, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      3000
    );
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

      // Updated to use Render BASE_URL
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
      showToast("Sync with Database Failed", "danger");
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
      // Updated to use Render BASE_URL
      const res = await fetch(
        `${BASE_URL}/api/users/update-profile/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
          }),
        }
      );
      const json = await res.json();
      if (json.success) {
        const updatedUser = { ...user, ...json.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        showToast("Profile Updated Successfully", "success");
      }
    } catch (err) {
      showToast("Server Connection Error", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Updated to use Render BASE_URL
      const res = await fetch(`${BASE_URL}/api/inquiry/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast("Status Updated");
        fetchData();
      }
    } catch (err) {
      showToast("Update failed", "danger");
    }
  };

  const handleAction = async (type, method, body = null, id = "") => {
    const endpoint = method === "DELETE" ? `delete/${id}` : "add";
    // Updated to use Render BASE_URL
    const url = `${BASE_URL}/api/admin/${type}/${endpoint}`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
      });
      if (res.ok) {
        showToast(`${type} updated`);
        setModals({ equipment: false, staff: false });
        fetchData();
      }
    } catch (err) {
      showToast("Operation failed", "danger");
    }
  };

  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      roles: ["ADMIN"],
    },
    {
      id: "inquiries",
      label: user?.role === "CLIENT" ? "My Requests" : "Inquiries",
      icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
      roles: ["ADMIN", "STAFF", "CLIENT"],
    },
    {
      id: "inventory",
      label: "Equipment",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      roles: ["ADMIN", "STAFF"],
    },
    {
      id: "staff",
      label: "Personnel",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      roles: ["ADMIN"],
    },
    {
      id: "applications",
      label: "Job Apps",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      roles: ["ADMIN"],
    },
    {
      id: "subscribers",
      label: "Subscribers",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      roles: ["ADMIN", "STAFF"],
    },
    {
      id: "profile",
      label: "My Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      roles: ["ADMIN", "STAFF", "CLIENT"],
    },
  ];

  if (!user) return null;

  return (
    <Layout>
      <div className="flex h-screen bg-[#F1F5F9] font-sans relative overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-slate-300 flex flex-col p-6 shadow-2xl transition-transform duration-300 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Crystal
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems
              .filter((item) => item.roles.includes(user.role))
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-slate-800"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon}
                    />
                  </svg>
                  {item.label}
                </button>
              ))}
          </nav>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/auth");
            }}
            className="p-3 text-sm text-slate-500 hover:text-red-400 flex items-center gap-3 border-t border-slate-800 mt-4"
          >
            Logout Account
          </button>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h2 className="text-slate-800 font-bold uppercase tracking-wider text-xs lg:text-sm truncate">
                {activeTab} Control
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {user.role}
              </span>
              <div
                onClick={() => setActiveTab("profile")}
                className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs cursor-pointer hover:ring-2 ring-blue-400"
              >
                {user.name.charAt(0)}
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-8 overflow-y-auto flex-1">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-100">
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl text-white font-black shadow-xl">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-black text-slate-800">
                        {user.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {user.role} Member
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
                    >
                      {loading ? "Updating..." : "Update Profile Settings"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 lg:space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                  {Object.entries(stats).map(([k, v]) => (
                    <div
                      key={k}
                      className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100"
                    >
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 truncate">
                        {k}
                      </p>
                      <span className="text-xl lg:text-3xl font-black text-slate-800">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 lg:p-8 rounded-[2rem] text-white shadow-xl">
                    <p className="text-xs font-bold opacity-70 uppercase mb-1">
                      Fleet Assets
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-black">
                      {totals.equipment}
                    </h1>
                  </div>
                  <div className="bg-slate-900 p-6 lg:p-8 rounded-[2rem] text-white shadow-xl">
                    <p className="text-xs font-bold opacity-50 uppercase mb-1">
                      Field Staff
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-black">
                      {totals.staff}
                    </h1>
                  </div>
                </div>
              </div>
            )}

            {/* DATA TABLES */}
            {[
              "inquiries",
              "inventory",
              "staff",
              "subscribers",
              "applications",
            ].includes(activeTab) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                    {activeTab === "subscribers"
                      ? "Newsletter Subscribers"
                      : activeTab === "applications"
                      ? "Job Applications"
                      : `${activeTab} Records`}
                  </h3>
                  <div className="flex w-full sm:w-auto gap-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="flex-1 px-4 py-2 border rounded-lg text-sm outline-none sm:w-64 focus:border-blue-500"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {["inventory", "staff"].includes(activeTab) && (
                      <button
                        onClick={() =>
                          setModals((prev) => ({
                            ...prev,
                            [activeTab === "inventory"
                              ? "equipment"
                              : "staff"]: true,
                          }))
                        }
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold border-b">
                      <tr>
                        <th className="px-6 py-4">
                          {activeTab === "subscribers"
                            ? "Email Address"
                            : activeTab === "applications"
                            ? "Applicant"
                            : "Name / Primary"}
                        </th>
                        <th className="px-6 py-4">
                          {activeTab === "subscribers"
                            ? "Joined"
                            : activeTab === "applications"
                            ? "Role / CV"
                            : "Category/Role"}
                        </th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(activeTab === "inventory"
                        ? equipment
                        : activeTab === "staff"
                        ? staff
                        : activeTab === "subscribers"
                        ? subscribers
                        : activeTab === "applications"
                        ? applications
                        : inquiries
                      )
                        .filter((item) =>
                          (
                            item.name ||
                            item.fullName ||
                            item.email ||
                            item.applicantName ||
                            ""
                          )
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        )
                        .map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 text-sm">
                                {activeTab === "applications"
                                  ? item.applicantName
                                  : activeTab === "subscribers"
                                  ? item.email
                                  : item.name || item.fullName}
                              </div>
                              <div className="text-xs text-slate-400 truncate max-w-[150px]">
                                {activeTab === "applications"
                                  ? item.applicantEmail
                                  : item.brand || item.email || item.specialty}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {activeTab === "applications" ? (
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                                    {item.roleApplied}
                                  </span>
                                  <a
                                    href={item.cvLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-slate-400 underline hover:text-blue-600"
                                  >
                                    Download CV
                                  </a>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600 uppercase">
                                  {activeTab === "subscribers"
                                    ? new Date(
                                        item.createdAt
                                      ).toLocaleDateString()
                                    : item.category ||
                                      item.role ||
                                      item.service}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {activeTab === "inquiries" ? (
                                <select
                                  value={item.status}
                                  onChange={(e) =>
                                    handleStatusUpdate(item.id, e.target.value)
                                  }
                                  className="text-[10px] font-bold px-2 py-1 rounded border bg-white"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </select>
                              ) : activeTab === "applications" ? (
                                <button
                                  onClick={() =>
                                    showToast("Application Accepted", "success")
                                  }
                                  className="bg-green-600 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-green-700"
                                >
                                  ACCEPT
                                </button>
                              ) : activeTab === "subscribers" ? (
                                <span className="text-[10px] text-slate-400 italic">
                                  SYSTEM RECORD
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleAction(
                                      activeTab === "inventory"
                                        ? "equipment"
                                        : "staff",
                                      "DELETE",
                                      null,
                                      item.id
                                    )
                                  }
                                  className="text-red-500 font-black text-[10px] hover:underline"
                                >
                                  REMOVE
                                </button>
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

        {toast.show && (
          <div
            className={`fixed bottom-8 right-4 lg:right-8 px-6 py-4 rounded-xl shadow-2xl border text-white font-bold text-xs uppercase z-[100] transition-all ${
              toast.type === "danger"
                ? "bg-red-600 border-red-500"
                : "bg-slate-900 border-slate-700"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
