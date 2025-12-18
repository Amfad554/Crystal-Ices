import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const Project = () => {
  const [activeTab, setActiveTab] = useState("All");

  const projects = [
    {
      id: 1,
      title: "Refinery Equipment Supply",
      category: "Oil & Gas",
      location: "Port Harcourt",
      description:
        "Procurement and delivery of specialized high-pressure valves and piping components for refinery maintenance.",
      status: "Completed",
      icon: "⛽",
    },
    {
      id: 2,
      title: "Industrial Site Preparation",
      category: "Machinery Rental",
      location: "Lekki Free Zone, Lagos",
      description:
        "Deployment of excavators and heavy-duty trucks for large-scale industrial foundation work.",
      status: "In Progress",
      icon: "🚜",
    },
    {
      id: 3,
      title: "Energy Estate Acquisition",
      category: "Real Estate",
      location: "Ibeju-Lekki",
      description:
        "Consultancy for the acquisition of 50 hectares of land for a proposed independent power plant.",
      status: "Completed",
      icon: "🏢",
    },
    {
      id: 4,
      title: "Offshore Logistics Support",
      category: "Consultancy",
      location: "Niger Delta",
      description:
        "Project management and regulatory compliance advisory for offshore equipment mobilization.",
      status: "Completed",
      icon: "🚢",
    },
    {
      id: 5,
      title: "Pipeline Integrity Inspection",
      category: "Oil & Gas",
      location: "Delta State",
      description:
        "Coordinating technical teams for the ultrasonic testing and repair of midstream pipeline assets.",
      status: "Completed",
      icon: "🛠️",
    },
    {
      id: 6,
      title: "Warehouse Construction Fleet",
      category: "Machinery Rental",
      location: "Ketu-Epe Expressway",
      description:
        "Rental of telescopic cranes and forklifts for the structural assembly of a multi-purpose warehouse.",
      status: "Completed",
      icon: "🏗️",
    },
    {
      id: 7,
      title: "LPG Plant Development",
      category: "Consultancy",
      location: "Ogun State Border",
      description:
        "End-to-end consultancy for NUPRC licensing and environmental impact assessments for a new LPG bottling plant.",
      status: "In Progress",
      icon: "🔥",
    },
    {
      id: 8,
      title: "Industrial Park Land Survey",
      category: "Real Estate",
      location: "Badagry Expressway",
      description:
        "Mapping and title perfection for a 20-unit industrial mini-estate targeting energy SMEs.",
      status: "Completed",
      icon: "📐",
    },
  ];

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  const categories = [
    "All",
    "Oil & Gas",
    "Machinery Rental",
    "Real Estate",
    "Consultancy",
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-center text-white">
          <h1 className="text-5xl font-extrabold mb-4 uppercase tracking-tighter">
            Our Track Record
          </h1>
          <p className="text-[#00A3A3] font-bold text-sm tracking-[0.2em] uppercase">
            Built on Reliability & Precision
          </p>
        </section>

        <section className="py-16 px-6 max-w-7xl mx-auto">
          {/* Functional Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-none font-bold text-[10px] uppercase tracking-widest border transition-all ${
                  activeTab === tab
                    ? "bg-[#00A3A3] text-white border-[#00A3A3]"
                    : "bg-white text-gray-400 border-gray-200 hover:border-[#00A3A3] hover:text-[#00A3A3]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Expanded Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white border border-gray-100 p-6 hover:shadow-2xl hover:border-[#00A3A3] transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 -mr-8 -mt-8 rotate-45 group-hover:bg-[#00A3A3] transition-colors"></div>

                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">
                  {project.icon}
                </div>

                <h3 className="text-lg font-bold text-[#0B2A4A] mb-2 leading-tight h-12 overflow-hidden">
                  {project.title}
                </h3>

                <p className="text-[11px] font-bold text-[#00A3A3] uppercase mb-4 tracking-wider">
                  {project.category}
                </p>

                <p className="text-gray-500 text-[13px] leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    📍 {project.location}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-50 py-20 px-6 text-center">
          <h2 className="text-2xl font-bold text-[#0B2A4A] mb-2">
            Want to see more of our work?
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Download our corporate profile for a complete list of technical
            capabilities and project history.
          </p>
          <button className="border-2 border-[#0B2A4A] text-[#0B2A4A] px-10 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#0B2A4A] hover:text-white transition-all">
            Download PDF Profile
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default Project;
