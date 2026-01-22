import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const serviceList = [
    {
      id: 1,
      title: "Consultancy & Project Management",
      icon: "⚙️",
      mainImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1600",
      description: "Expert guidance for complex energy projects.",
      fullContent: {
        intro: "We bridge the gap between technical complexity and project success. Our consultants bring decades of experience in the Nigerian energy landscape.",
        features: [
          "NUPRC/DPR Permit Processing & Compliance",
          "Environmental Impact Assessment (EIA)",
          "FEED & Detailed Engineering Design Oversight",
          "Risk Mitigation & Quality Assurance"
        ],
        gallery: [
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800"
        ]
      }
    },
    {
      id: 2,
      title: "Heavy Duty Machinery",
      icon: "🏗️",
      mainImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1600",
      description: "Sales and rental solutions for industrial machinery.",
      fullContent: {
        intro: "Our fleet consists of the latest Caterpillar and Komatsu models, optimized for the toughest Nigerian terrains.",
        features: [
          "Flexible Short-term & Long-term Leasing",
          "On-site Maintenance & Technical Support",
          "Certified Heavy Equipment Operators",
          "Logistics & Equipment Tracking"
        ],
        gallery: [
          "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
        ]
      }
    }
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* --- MAIN SERVICES GRID --- */}
        <section className="bg-slate-900 py-24 px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Our Expertise</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Delivering world-class industrial solutions tailored for the Nigerian market.
          </p>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {serviceList.map((service) => (
            <div key={service.id} className="group cursor-pointer bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:border-blue-500 transition-all">
              <div className="h-64 overflow-hidden">
                <img src={service.mainImage} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6">{service.description}</p>
                <button 
                  onClick={() => setSelectedService(service)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all"
                >
                  Explore Details
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* --- FULL PAGE IMMERSIVE VIEW --- */}
        {selectedService && (
          <div className="fixed inset-0 bg-white z-[999] overflow-y-auto">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-50 px-6 py-4 flex justify-between items-center">
              <h2 className="font-black text-slate-900 uppercase tracking-tighter">{selectedService.title}</h2>
              <button 
                onClick={() => setSelectedService(null)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-500 transition-colors"
              >
                Close Page ✕
              </button>
            </div>

            {/* 1. Hero Image Section */}
            <div className="relative h-[60vh] w-full">
              <img src={selectedService.mainImage} className="w-full h-full object-cover" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </div>

            {/* 2. Content Body */}
            <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10 pb-24">
              <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="md:w-2/3">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">Service Overview</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                      {selectedService.title}
                    </h2>
                    <p className="text-xl text-slate-600 leading-relaxed mb-8">
                      {selectedService.fullContent.intro}
                    </p>
                    
                    <h4 className="text-xl font-bold text-slate-900 mb-6">Key Capabilities:</h4>
                    <ul className="grid grid-cols-1 gap-4">
                      {selectedService.fullContent.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                          <span className="font-semibold text-slate-800">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sidebar Contact Info */}
                  <div className="md:w-1/3 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                      <h4 className="font-bold text-xl mb-4">Request This Service</h4>
                      <p className="text-slate-400 text-sm mb-6">Our technical team responds within 24 hours with a comprehensive quote.</p>
                      <button className="w-full bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all">
                        Get a Quotation
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Image Gallery Section */}
                <div className="mt-20">
                  <h4 className="text-2xl font-black text-slate-900 mb-10 text-center">Project Gallery</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedService.fullContent.gallery.map((img, i) => (
                      <div key={i} className="h-80 rounded-[2rem] overflow-hidden shadow-lg">
                        <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Gallery" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Services;