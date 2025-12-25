import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    name: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmpassword: "",
  });

  const showAlert = (message, type = "error") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = view === "login" ? "login" : "register";
   const apiUrl = `https://crystalbackend.onrender.com/api/users/${endpoint}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        if (view === "login") {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));
          navigate("/dashboard");
        } else {
          showAlert("Registration successful!", "success");
          setView("login");
        }
      } else {
        showAlert(result.message || "Authentication failed");
      }
    } catch (error) {
      showAlert("Connection to server failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0B2A4A] text-white">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-xl mb-8">CI</div>
              <h1 className="text-4xl font-bold leading-tight mb-6">
                {view === "login" ? "Welcome Back" : "Join Our Network"}
              </h1>
              <p className="text-slate-300 text-lg max-w-sm">
                Secure access to industrial procurement and equipment tracking.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-12 lg:p-16 overflow-y-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {view === "login" ? "Client Login" : "Create Account"}
            </h2>

            {alert.show && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${alert.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                {alert.message}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {view === "signup" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">First Name</label>
                      <input type="text" name="firstname" required value={formData.firstname} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Last Name</label>
                      <input type="text" name="lastname" required value={formData.lastname} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Business Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Phone Number</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Office Address</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PASSWORD FIELD */}
                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    required 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm pr-16" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-[30px] text-[9px] font-black text-blue-600 uppercase hover:text-blue-800 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* CONFIRM PASSWORD FIELD */}
                {view === "signup" && (
                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Confirm</label>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmpassword" 
                      required 
                      value={formData.confirmpassword} 
                      onChange={handleChange} 
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm pr-16" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="absolute right-3 top-[30px] text-[9px] font-black text-blue-600 uppercase hover:text-blue-800 transition-colors"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#0B2A4A] hover:bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-lg active:scale-[0.98] mt-4">
                {loading ? "Processing..." : view === "login" ? "Sign In" : "Complete Registration"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <button onClick={() => setView(view === "login" ? "signup" : "login")} className="text-blue-600 font-bold text-xs hover:underline">
                {view === "login" ? "Need an account? Register Now" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Auth;