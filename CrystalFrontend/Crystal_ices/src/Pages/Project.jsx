import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const Project = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

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
    {
      id: 2,
      title: "Industrial Site Preparation",
      category: "Machinery Rental",
      location: "Lekki Free Zone, Lagos",
      description: "Deployment of excavators and heavy-duty trucks for large-scale industrial foundation work.",
      fullDetails: "Provided a fleet of 15 heavy-duty excavators and 10 dump trucks for land clearing and foundation grading. Managed onsite maintenance teams to ensure 99% equipment uptime.",
      status: "In Progress",
      icon: "🚜",
    },
    {
      id: 3,
      title: "Energy Estate Acquisition",
      category: "Real Estate",
      location: "Ibeju-Lekki",
      description: "Consultancy for the acquisition of 50 hectares of land for a proposed independent power plant.",
      fullDetails: "Facilitated title verification, community relations, and government survey approvals for a strategic energy infrastructure plot.",
      status: "Completed",
      icon: "🏢",
    },
    {
      id: 4,
      title: "Offshore Logistics Support",
      category: "Consultancy",
      location: "Niger Delta",
      description: "Project management and regulatory compliance advisory for offshore equipment mobilization.",
      fullDetails: "Managed the technical documentation and regulatory permits required for moving offshore drilling equipment across state maritime borders.",
      status: "Completed",
      icon: "🚢",
    },
    {
      id: 5,
      title: "Pipeline Integrity Inspection",
      category: "Oil & Gas",
      location: "Delta State",
      description: "Coordinating technical teams for the ultrasonic testing and repair of midstream pipeline assets.",
      fullDetails: "Deployed NDT (Non-Destructive Testing) specialists to identify corrosion points in a 12km pipeline segment and managed the subsequent reinforcement works.",
      status: "Completed",
      icon: "🛠️",
    },
    {
      id: 6,
      title: "Warehouse Construction Fleet",
      category: "Machinery Rental",
      location: "Ketu-Epe Expressway",
      description: "Rental of telescopic cranes and forklifts for the structural assembly of a multi-purpose warehouse.",
      fullDetails: "Supplied 50-ton mobile cranes for the assembly of steel rafters and heavy-duty forklifts for inventory movement during the construction phase.",
      status: "Completed",
      icon: "🏗️",
    },
    {
      id: 7,
      title: "LPG Plant Development",
      category: "Consultancy",
      location: "Ogun State Border",
      description: "End-to-end consultancy for NUPRC licensing and environmental impact assessments for a new LPG bottling plant.",
      fullDetails: "Guided the client through the complex NUPRC (formerly DPR) approval process, including fire safety certifications and technical site audits.",
      status: "In Progress",
      icon: "🔥",
    },
    {
      id: 8,
      title: "Industrial Park Land Survey",
      category: "Real Estate",
      location: "Badagry Expressway",
      description: "Mapping and title perfection for a 20-unit industrial mini-estate targeting energy SMEs.",
      fullDetails: "Conducted perimeter surveys and topographical mapping to subdivide land for industrial use, ensuring all zoning laws were strictly followed.",
      status: "Completed",
      icon: "📐",
    },
  ];

  const categories = ["All", "Oil & Gas", "Machinery Rental", "Real Estate", "Consultancy"];

  const filteredProjects = projects.filter((p) => {
    const matchesTab = activeTab === "All" || p.category === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownload = () => {
    // This creates a direct download trigger
    const link = document.createElement('a');
    link.href = '/corporate-profile.pdf'; // Must be in /public/ folder
    link.setAttribute('download', 'Corporate_Profile.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen relative">
        {/* Hero Section */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Track Record</h1>
            <p className="text-gray-300 text-lg">Built on Reliability & Precision. Delivering excellence across Nigeria.</p>
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search projects or locations..." 
                className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#00A3A3] shadow-sm transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all border ${
                  activeTab === tab ? "bg-[#00A3A3] text-white border-[#00A3A3] shadow-md" : "bg-white text-gray-500 border-gray-200 hover:border-[#00A3A3]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                >
                  <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all">{project.icon}</div>
                  <h3 className="text-2xl font-bold text-[#0B2A4A] mb-3 group-hover:text-[#00A3A3] transition-colors">{project.title}</h3>
                  <p className="text-[#00A3A3] font-bold text-[10px] uppercase tracking-widest mb-4 bg-teal-50 inline-block w-fit px-3 py-1 rounded-md">{project.category}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-xs font-medium text-gray-400">📍 {project.location}</span>
                    <span className="text-[#0B2A4A] font-black text-[10px] uppercase tracking-tighter">Details →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium italic">No projects found matching your search.</p>
            </div>
          )}
        </section>

        {/* --- MODAL SECTION --- */}
        {selectedProject && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)} // Close on background click
          >
            <div 
              className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()} // Prevent close on modal click
            >
              <div className="bg-[#0B2A4A] p-10 text-white relative">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all"
                >
                  ✕
                </button>
                <span className="text-6xl mb-6 block">{selectedProject.icon}</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{selectedProject.title}</h2>
                <div className="flex items-center gap-4">
                    <p className="text-teal-400 font-bold uppercase tracking-widest text-xs">{selectedProject.category}</p>
                    <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                    <p className="text-white/60 text-xs">{selectedProject.location}</p>
                </div>
              </div>
              <div className="p-10">
                <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-100">
                  <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className={`font-bold ${selectedProject.status === 'Completed' ? 'text-green-600' : 'text-blue-500'}`}>
                        {selectedProject.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Reference ID</p>
                    <p className="font-bold text-[#0B2A4A]">PRJ-00{selectedProject.id}NG</p>
                  </div>
                </div>
                <div className="space-y-4 mb-10">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Technical Overview</p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                    {selectedProject.fullDetails || selectedProject.description}
                    </p>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full bg-[#0B2A4A] text-white py-5 rounded-2xl font-bold hover:bg-[#00A3A3] transition-all uppercase tracking-widest text-xs shadow-xl shadow-blue-900/10"
                >
                  Return to Projects
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <section className="bg-gray-50 py-24 px-6 text-center border-t border-gray-100">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-4">Ready for Collaboration?</h2>
            <p className="text-gray-500 mb-10">Access our comprehensive capability statement for deep-dive technical data.</p>
            <button 
                onClick={handleDownload}
                className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-200 bg-[#0B2A4A] rounded-xl hover:bg-[#00A3A3] focus:outline-none"
            >
                Download PDF Profile
                <span className="ml-3 group-hover:translate-y-1 transition-transform">↓</span>
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Project;