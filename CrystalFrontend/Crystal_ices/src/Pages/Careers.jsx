import React, { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const Careers = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", cvLink: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });

  const openRoles = [
    {
      title: "Project Engineer (Oil & Gas)",
      location: "Lagos / Port Harcourt",
      type: "Full-Time",
      department: "Technical",
    },
    {
      title: "Procurement Specialist",
      location: "Ketu, Lagos",
      type: "Full-Time",
      department: "Supply Chain",
    },
    {
      title: "Heavy Equipment Operator",
      location: "Field Operations",
      type: "Contract",
      department: "Operations",
    },
  ];

  const benefits = [
    {
      title: "Professional Growth",
      desc: "Access to industry-leading training and global certifications.",
      icon: "📈",
    },
    {
      title: "Safety First",
      desc: "A world-class HSE culture that prioritizes your physical and mental wellbeing.",
      icon: "🛡️",
    },
    {
      title: "National Impact",
      desc: "Work on critical infrastructure that powers the Nigerian economy.",
      icon: "🇳🇬",
    },
  ];

  const handleApply = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Submitting application..." });
    const BASE_URL = "https://crystalbackend.onrender.com";

    try {
      const response = await fetch(`${BASE_URL}/api/users/careers/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, roleTitle: selectedRole.title }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus({ type: "success", msg: "Application sent successfully!" });
        setFormData({ name: "", email: "", cvLink: "" });
        setTimeout(() => {
          setIsModalOpen(false);
          setStatus({ type: "", msg: "" });
        }, 2000);
      } else {
        setStatus({ type: "error", msg: data.message || "Submission failed." });
      }
    } catch (err) {
      console.log(err);
      
      setStatus({ type: "error", msg: "Network error. Please try again." });
    }
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section - Aligned with Project/About */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Build Your Future With Us</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Join a team of indigenous innovators shaping the energy and infrastructure landscape of Africa.
            </p>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="bg-gray-50 aspect-video rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner text-gray-400 italic">
            {/* Replace with actual team photo */}
            Corporate Culture & Team Environment
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-8">Why Join Crystal Ices?</h2>
            <div className="space-y-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-6">
                  <span className="text-4xl">{benefit.icon}</span>
                  <div>
                    <h4 className="text-xl font-bold text-[#0B2A4A] mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Openings - Aligned list style */}
        <section className="py-24 bg-gray-50 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#0B2A4A] mb-4">Current Openings</h2>
              <div className="h-1 w-20 bg-[#00A3A3] mx-auto"></div>
            </div>
            
            <div className="space-y-6">
              {openRoles.map((role, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    <span className="text-[#00A3A3] text-xs font-bold uppercase tracking-widest mb-2 block">
                      {role.department}
                    </span>
                    <h3 className="text-2xl font-bold text-[#0B2A4A] mb-2">
                      {role.title}
                    </h3>
                    <div className="flex gap-4 text-gray-500 text-sm font-medium">
                      <span>📍 {role.location}</span>
                      <span>•</span>
                      <span>⏱️ {role.type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(role)}
                    className="w-full md:w-auto bg-[#0B2A4A] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00A3A3] transition-all shadow-md active:scale-95"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APPLICATION MODAL - Modernized */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#0B2A4A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-[#0B2A4A] mb-2">Apply for Position</h2>
              <p className="text-[#00A3A3] font-bold text-sm uppercase tracking-wide mb-8">
                {selectedRole?.title}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#00A3A3] focus:bg-white transition-all"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#00A3A3] focus:bg-white transition-all"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Link to CV (Drive/Dropbox)</label>
                  <input
                    type="url"
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#00A3A3] focus:bg-white transition-all"
                    onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
                  />
                </div>
                <button className="w-full bg-[#0B2A4A] text-white py-4 rounded-xl font-bold hover:bg-[#00A3A3] shadow-lg transition-all mt-4">
                  Submit Application
                </button>
                
                {status.msg && (
                  <div className={`p-4 rounded-lg text-center text-sm font-bold ${
                    status.type === "error" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
                  }`}>
                    {status.msg}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Careers;