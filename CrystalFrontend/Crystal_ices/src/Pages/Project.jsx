import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const Project = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null); // Modal State

  const projects = [
    {
      id: 1,
      title: "Refinery Equipment Supply",
      category: "Oil & Gas",
      location: "Port Harcourt",
      description: "Procurement and delivery of specialized high-pressure valves and piping components for refinery maintenance.",
      fullDetails: "This project involved the sourcing of ISO-certified valves from global partners, logistics management through the Onne Port, and technical verification upon delivery to ensure zero-leak compliance.",
      status: "Completed",
      icon: "⛽",
    },
    // ... rest of your project objects
  ];

  const categories = ["All", "Oil & Gas", "Machinery Rental", "Real Estate", "Consultancy"];

  // Search & Filter Logic
  const filteredProjects = projects.filter((p) => {
    const matchesTab = activeTab === "All" || p.category === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownload = () => {
    // Replace with your actual file path in the public folder
    window.open('/corporate-profile.pdf', '_blank');
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen relative">
        {/* Hero Section */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Track Record</h1>
            <p className="text-gray-300 text-lg">Built on Reliability & Precision. Delivering excellence across Nigeria.</p>
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10">
            <input 
              type="text" 
              placeholder="Search by project or location..." 
              className="w-full px-6 py-3 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-[#00A3A3]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all border ${
                  activeTab === tab ? "bg-[#00A3A3] text-white" : "bg-white text-gray-600 hover:border-[#00A3A3]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-2xl transition-all flex flex-col"
              >
                <div className="text-5xl mb-6">{project.icon}</div>
                <h3 className="text-2xl font-bold text-[#0B2A4A] mb-3">{project.title}</h3>
                <p className="text-[#00A3A3] font-semibold text-sm uppercase mb-4">{project.category}</p>
                <p className="text-gray-600 mb-6 flex-grow">{project.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="text-sm text-gray-500">📍 {project.location}</span>
                  <span className="text-blue-600 font-bold text-xs uppercase">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- MODAL SECTION --- */}
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="bg-[#0B2A4A] p-8 text-white flex justify-between items-start">
                <div>
                  <span className="text-4xl mb-4 block">{selectedProject.icon}</span>
                  <h2 className="text-3xl font-bold">{selectedProject.title}</h2>
                  <p className="text-teal-400 font-medium">{selectedProject.category}</p>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-gray-400 text-sm uppercase">Location</p>
                    <p className="font-bold text-[#0B2A4A]">{selectedProject.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm uppercase">Status</p>
                    <p className="font-bold text-green-600">{selectedProject.status}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {selectedProject.fullDetails || selectedProject.description}
                </p>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full bg-[#00A3A3] text-white py-4 rounded-xl font-bold hover:bg-[#008282] transition-colors"
                >
                  Close Project View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <section className="bg-gray-50 py-20 px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0B2A4A] mb-8">Want to see more of our work?</h2>
          <button 
            onClick={handleDownload}
            className="bg-[#0B2A4A] text-white px-10 py-4 rounded-lg font-bold hover:bg-[#00A3A3] transition-all"
          >
            Download PDF Profile
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default Project;