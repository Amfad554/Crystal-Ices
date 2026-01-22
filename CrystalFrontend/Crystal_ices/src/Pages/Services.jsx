import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const serviceList = [
    {
      id: 1,
      title: "Consultancy & Project Management",
      icon: "⚙️",
      mainImage:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1600",
      description: "Expert guidance for complex energy projects.",
      fullContent: {
        intro:
          "We provide specialized technical advisory and end-to-end project management for the Nigerian energy sector, ensuring compliance with NUPRC and international standards.",
        features: [
          "NUPRC/DPR Permit Processing",
          "Environmental Impact Assessments",
          "Project Lifecycle Management",
          "Regulatory Compliance Audits",
        ],
        gallery: [
          "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=800",
        ],
      },
    },
    {
      id: 2,
      title: "Oil & Gas Equipment Procurement",
      icon: "💧",
      mainImage:
        "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1600",
      description: "Sourcing high-grade infrastructure components.",
      fullContent: {
        intro:
          "Strategic sourcing of precision-engineered components for refineries, pump stations, and jetty terminals across Lagos and the Niger Delta.",
        features: [
          "Industrial Valve Procurement",
          "Refinery Component Sourcing",
          "Global Supply Chain Logistics",
          "Quality Assurance & Inspection",
        ],
        gallery: [
          "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
        ],
      },
    },
    {
      id: 3,
      title: "Heavy Duty Machinery",
      icon: "🏗️",
      mainImage:
        "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800",
      description: "Sales and rental solutions for industrial machinery.",
      fullContent: {
        intro:
          "Our fleet provides the backbone for Lagos's biggest construction and energy projects, featuring maintained plant equipment and expert operators.",
        features: [
          "Excavator & Crane Leasing",
          "Preventative Maintenance Plans",
          "Certified Operator Manpower",
          "24/7 On-site Technical Support",
        ],
        gallery: [
          "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800",
        ],
      },
    },
    {
      id: 4,
      title: "Industrial & Energy Real Estate",
      icon: "🏢",
      mainImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600",
      description: "Strategic real estate solutions for the energy sector.",
      fullContent: {
        intro:
          "Facilitating the acquisition and development of high-value industrial land for tank farms, warehouses, and energy facilities in Lagos.",
        features: [
          "Industrial Land Acquisition",
          "Tank Farm Site Development",
          "Facility Lease Management",
          "Zoning & Legal Compliance",
        ],
        gallery: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
        ],
      },
    },
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* --- HERO SECTION --- */}
        <section className="bg-[#0B2A4A] py-16 px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Professional energy consultancy and industrial infrastructure
            solutions.
          </p>
        </section>

        {/* --- SERVICES GRID --- */}
        <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceList.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.mainImage}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <span className="text-2xl mb-2">{service.icon}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 flex-grow">
                  {service.description}
                </p>
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-blue-600 font-bold text-xs uppercase tracking-wider hover:text-blue-800 transition-colors inline-flex items-center gap-2"
                >
                  Learn More <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* --- FULL-PAGE MODAL VIEW --- */}
        {selectedService && (
          <div className="fixed inset-0 bg-white z-[999] overflow-y-auto">
            {/* Header Navigation */}
            <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b z-50 px-6 py-4 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                {selectedService.title}
              </span>
              <button
                onClick={() => setSelectedService(null)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-all"
              >
                Close ✕
              </button>
            </nav>

            {/* Sub-Website Content */}
            <article>
              {/* Banner */}
              <div className="h-[40vh] md:h-[50vh] relative">
                <img
                  src={selectedService.mainImage}
                  className="w-full h-full object-cover"
                  alt="Service Header"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-8 md:p-16">
                  <h2 className="text-white text-3xl md:text-5xl font-black max-w-3xl">
                    {selectedService.title}
                  </h2>
                </div>
              </div>

              {/* Main Content */}
              <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Service Overview
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-10">
                    {selectedService.fullContent.intro}
                  </p>

                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Capabilities & Specializations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {selectedService.fullContent.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl"
                      >
                        <span className="text-blue-600 font-bold">●</span>
                        <span className="text-slate-800 font-medium text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Operational Showcase
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedService.fullContent.gallery.map((img, i) => (
                      <div key={i} className="h-64 rounded-2xl overflow-hidden">
                        <img
                          src={img}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                          alt="Gallery"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 sticky top-24">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">
                      Direct Inquiry
                    </h4>
                    <p className="text-sm text-slate-500 mb-6">
                      Consult with our engineering team regarding your specific
                      project requirements.
                    </p>
                    <button
                      onClick={() => {
                        const element =
                          document.getElementById("quotation-section");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-blue-700 transition-all mb-4"
                    >
                      Request Quotation
                    </button>
                    <div className="pt-6 border-t border-slate-200">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">
                        Technical Standards
                      </p>
                      <p className="text-xs text-slate-600">
                        ISO 9001:2015 Compliant Processes • NUPRC Certified
                        Vendor
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Services;
