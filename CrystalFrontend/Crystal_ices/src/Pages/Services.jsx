import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const Services = () => {
  // 1. State to manage which service is being viewed in the modal
  const [selectedService, setSelectedService] = useState(null);

  const serviceList = [
    {
      id: 1,
      title: "Consultancy & Project Management",
      description: "Expert guidance for complex energy projects.",
      details:
        "Our consultancy division specializes in NUPRC/DPR permit processing, environmental impact assessments, and end-to-end project lifecycle management. We ensure your energy projects meet international safety and efficiency standards.",
      icon: "⚙️",
    },
    {
      id: 2,
      title: "Oil & Gas Equipment Procurement",
      description: "Sourcing high-grade infrastructure components.",
      details:
        "We leverage a global network of manufacturers to provide precision-engineered valves, pipes, and refinery components. Our supply chain ensures zero-defect delivery directly to your site.",
      icon: "💧",
    },
    {
      id: 3,
      title: "Heavy Duty Machinery",
      description: "Sales and rental solutions for industrial machinery.",
      details:
        "From Caterpillar excavators to specialized industrial cranes, our fleet is maintained to peak performance. We offer flexible daily, monthly, or project-based rental contracts tailored to your budget.",
      icon: "🏗️",
    },
    {
      id: 4,
      title: "Industrial & Energy Real Estate",
      description: "Strategic real estate solutions for the energy sector.",
      details:
        "We assist in securing land for tank farms, refineries, and warehouses. Our legal team ensures all industrial real estate transactions are fully compliant with Nigerian land laws.",
      icon: "🏢",
    },
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen relative">
        {/* Hero Section */}
        <section className="bg-[#0B2A4A] py-20 px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-gray-300">Excellence in Energy & Infrastructure</p>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceList.map((service) => (
            <div
              key={service.id}
              className="p-8 border border-gray-100 rounded-xl bg-gray-50"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-[#0B2A4A] mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">{service.description}</p>

              {/* 2. Button triggers the Modal */}
              <button
                onClick={() => setSelectedService(service)}
                className="text-[#00A3A3] font-semibold hover:text-[#0B2A4A] transition-colors"
              >
                Learn More →
              </button>
            </div>
          ))}
        </section>

        {/* 3. The Modal UI */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>

              <div className="text-4xl mb-4">{selectedService.icon}</div>
              <h2 className="text-2xl font-bold text-[#0B2A4A] mb-4">
                {selectedService.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {selectedService.details}
              </p>

              <button
                onClick={() => setSelectedService(null)}
                className="w-full bg-[#0B2A4A] text-white py-3 rounded-lg font-bold hover:bg-[#00A3A3] transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Services;
