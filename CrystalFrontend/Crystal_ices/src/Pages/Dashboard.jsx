/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- ICONS ---
const Icons = {
  Dashboard: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  ),
  Users: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  ),
  Settings: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
    </svg>
  ),
  Logout: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    </svg>
  ),
  UserCircle: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.963-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Menu: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  ),
};

// --- SUB-COMPONENTS ---

const UserManagementTable = ({ currentUser, onUserUpdate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchUsers = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/users/all");
    const data = await response.json();
    
    if (data.success) {
      // FILTER: Only keep users whose role is "CLIENT"
      const onlyClients = data.data.filter(u => u.role === "CLIENT");
      setUsers(onlyClients);
    }
  } catch (err) {
    console.error("Fetch failed");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (targetUserId, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/update-role/${targetUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await response.json(); // Get the response body

      if (response.ok && data.success) {
        // 1. If we updated OUR OWN role, update our local session
        if (targetUserId === currentUser.id) {
          const updated = { ...currentUser, role: newRole };
          localStorage.setItem("user", JSON.stringify(updated));
          onUserUpdate(updated);
        }

        // 2. Refresh the whole table to show the new database state
        fetchUsers();

        alert("Role updated successfully!");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/delete/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-slate-400">
        Loading Database...
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-800">User Control Center</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-slate-50">
            <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b">
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Level</th>
              {currentUser.role === "ADMIN" && (
                <th className="px-6 py-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/30">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-700">{u.name}</p>
                  <p className="text-[11px] text-slate-400">{u.email}</p>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    disabled={
                      currentUser.role === "STAFF" && u.role === "ADMIN"
                    }
                    className="text-[11px] font-bold bg-slate-100 border-none rounded p-1 outline-none cursor-pointer"
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  {currentUser.role === "ADMIN" && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AccountSettings = ({ user, onUserUpdate }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    newPass: "",
  });
  const [status, setStatus] = useState({ msg: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/update-profile/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const result = await response.json();
      if (response.ok) {
        const updated = { ...user, ...result.user };
        localStorage.setItem("user", JSON.stringify(updated));
        onUserUpdate(updated);
        setStatus({ msg: "Profile Synced!", type: "success" });
      }
    } catch (err) {
      setStatus({ msg: "Error connecting to DB", type: "error" });
    }
    setTimeout(() => setStatus({ msg: "", type: "" }), 3000);
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-6">
        Profile Settings
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 ring-blue-500/20"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 ring-blue-500/20"
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Update Profile
        </button>
        {status.msg && (
          <p
            className={`text-center text-xs font-bold mt-4 ${
              status.type === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {status.msg}
          </p>
        )}
      </form>
    </div>
  );
};

// --- MAIN DASHBOARD ---

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [activeTab, setActiveTab] = useState("overview"); // Default tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  if (!user) return null;

  const menuItems = {
    ADMIN: [
      { id: "overview", label: "Overview", icon: Icons.Dashboard },
      { id: "users", label: "User Management", icon: Icons.Users },
      { id: "settings", label: "Account", icon: Icons.Settings },
    ],
    STAFF: [
      { id: "overview", label: "Staff Portal", icon: Icons.Dashboard },
      { id: "users", label: "Client List", icon: Icons.Users },
      { id: "settings", label: "Account", icon: Icons.Settings },
    ],
    CLIENT: [
      { id: "overview", label: "Dashboard", icon: Icons.Dashboard },
      { id: "settings", label: "My Account", icon: Icons.Settings },
    ],
  };

  const currentMenu = menuItems[user.role] || menuItems.CLIENT;

  return (
    <div className="flex h-screen bg-[#FBFCFE] font-sans antialiased text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1224] text-slate-400 flex flex-col transition-transform lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 font-black text-white text-lg tracking-tighter">
          CRYSTAL ICE
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {currentMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-blue-600/10 text-blue-500 font-bold"
                  : "hover:text-slate-200"
              }`}
            >
              <item.icon /> <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/auth");
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-400 font-bold text-sm"
          >
            <Icons.Logout /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8">
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Icons.Menu />
          </button>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {activeTab}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-black text-slate-800">{user.name}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase">
                {user.role}
              </p>
            </div>
            <div className="text-slate-300">
              <Icons.UserCircle />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          {/* TAB 1: OVERVIEW (First thing user sees) */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400 text-[10px] font-black uppercase mb-1">
                    Status
                  </p>
                  <h4 className="text-2xl font-black text-green-500">Online</h4>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400 text-[10px] font-black uppercase mb-1">
                    Identity
                  </p>
                  <h4 className="text-2xl font-black text-blue-500">
                    Verified
                  </h4>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400 text-[10px] font-black uppercase mb-1">
                    Access Level
                  </p>
                  <h4 className="text-2xl font-black text-indigo-500">
                    {user.role}
                  </h4>
                </div>
              </div>
              <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-2">
                  Welcome Back, {user.name}!
                </h2>
                <p className="text-slate-500">
                  All systems are operational. Your account is synchronized with
                  the main database.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === "users" && (
            <UserManagementTable currentUser={user} onUserUpdate={setUser} />
          )}

          {/* TAB 3: ACCOUNT SETTINGS */}
          {activeTab === "settings" && (
            <AccountSettings user={user} onUserUpdate={setUser} />
          )}
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
