import React, { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const Careers = () => {
  const [selectedRole, setSelectedRole] = useState(null); // Tracks which role is being applied for
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
      title: "Growth",
      desc: "Access to industry-leading training and certifications.",
      icon: "📈",
    },
    {
      title: "Safety",
      desc: "A world-class HSE culture that prioritizes your wellbeing.",
      icon: "🛡️",
    },
    {
      title: "Impact",
      desc: "Work on infrastructure that powers the Nigerian economy.",
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

    try {
      // Inside Careers.jsx handleSubmit function
      const response = await fetch(
        "http://localhost:5000/api/users/careers/apply",
        {
          // Added /users
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            roleTitle: selectedRole.title,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setStatus({ type: "success", msg: "Application sent successfully!" });
        setFormData({ name: "", email: "", cvLink: "" });
        setTimeout(() => setIsModalOpen(false), 2000);
      } else {
        setStatus({ type: "error", msg: "Submission failed. Try again." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Server error. Please try later." });
    }
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-center text-white relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Build Your Future With Us
            </h1>
            <p className="text-gray-300 text-lg">
              Join a team of innovators shaping Nigeria's energy landscape.
            </p>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="bg-gray-100 aspect-video rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
            [Photo of Team]
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-6">
              Why Join Crystal Ices?
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-2xl">{benefit.icon}</span>
                  <div>
                    <h4 className="font-bold text-[#0B2A4A]">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-gray-500">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-20 bg-gray-50 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-8">
              Current Openings
            </h2>
            <div className="space-y-4">
              {openRoles.map((role, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                  <div>
                    <h3 className="text-xl font-bold text-[#0B2A4A]">
                      {role.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      📍 {role.location} • {role.department}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApply(role)}
                    className="bg-[#0B2A4A] text-white px-6 py-2 rounded font-bold hover:bg-[#00A3A3] transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APPLICATION MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-[#0B2A4A] mb-2">
                Apply for Position
              </h2>
              <p className="text-[#00A3A3] font-bold mb-6">
                {selectedRole?.title}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:border-[#00A3A3]"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:border-[#00A3A3]"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  type="url"
                  placeholder="Link to CV (Google Drive/Dropbox)"
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:border-[#00A3A3]"
                  onChange={(e) =>
                    setFormData({ ...formData, cvLink: e.target.value })
                  }
                />
                <button className="w-full bg-[#0B2A4A] text-white py-3 rounded-lg font-bold hover:bg-[#00A3A3]">
                  Submit Application
                </button>
                {status.msg && (
                  <p
                    className={`text-center text-sm font-bold ${
                      status.type === "error"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {status.msg}
                  </p>
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
