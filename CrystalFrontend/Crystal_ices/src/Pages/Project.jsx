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
      description: "Procurement and delivery of specialized high-pressure valves and piping components for refinery maintenance.",
      status: "Completed",
      icon: "⛽",
    },
    // ... rest of your project data
  ];

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  const categories = ["All", "Oil & Gas", "Machinery Rental", "Real Estate", "Consultancy"];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Hero Section - Aligned with About Header style */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Track Record</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Built on Reliability & Precision. Delivering excellence across the Nigerian industrial landscape.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          {/* Functional Filters - Cleaned up typography */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all border ${
                  activeTab === tab
                    ? "bg-[#00A3A3] text-white border-[#00A3A3]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#00A3A3]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid - Standardized text sizes to match About page */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-6">{project.icon}</div>

                <h3 className="text-2xl font-bold text-[#0B2A4A] mb-3">
                  {project.title}
                </h3>

                <p className="text-[#00A3A3] font-semibold text-sm uppercase tracking-wide mb-4">
                  {project.category}
                </p>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500">
                    📍 {project.location}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 bg-green-50 text-green-600 rounded-full">
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action - Font weights aligned with About section */}
        <section className="bg-gray-50 py-20 px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0B2A4A] mb-4">
            Want to see more of our work?
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            Download our corporate profile for a complete list of technical
            capabilities and project history.
          </p>
          <button className="bg-[#0B2A4A] text-white px-10 py-4 rounded-lg font-bold hover:bg-[#00A3A3] transition-all shadow-lg">
            Download PDF Profile
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default Project;