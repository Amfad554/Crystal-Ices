import Layout from "../Shared/Layout/Layout";

const Careers = () => {
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
              Join a team of innovators and experts shaping the energy and
              infrastructure landscape of Nigeria.
            </p>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="bg-gray-100 aspect-video rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
            [Photo of Crystal Ices Team in the Field]
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-6">
              Why Join Crystal Ices?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At Crystal Ices Energies Nigeria Limited, we believe our greatest
              asset is our people. We foster a culture of technical excellence,
              integrity, and collaborative problem-solving.
            </p>
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

        {/* Job Openings Section */}
        <section className="py-20 bg-gray-50 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-[#0B2A4A]">
                  Current Openings
                </h2>
                <p className="text-gray-500">Find your next challenge</p>
              </div>
              <span className="text-[#00A3A3] font-bold text-sm bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                {openRoles.length} Positions Available
              </span>
            </div>

            <div className="space-y-4">
              {openRoles.map((role, idx) => (
                <div
                  key={idx}
                  className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#00A3A3] hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="text-xl font-bold text-[#0B2A4A] group-hover:text-[#00A3A3] transition-colors">
                      {role.title}
                    </h3>
                    <div className="flex gap-4 mt-1 text-sm text-gray-400">
                      <span>📍 {role.location}</span>
                      <span>📁 {role.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {role.type}
                    </span>
                    <button className="flex-1 md:flex-none bg-[#0B2A4A] text-white px-6 py-2 rounded font-bold text-sm hover:bg-[#00A3A3] transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Don't see a matching role? Send your CV to
                <span className="text-[#0B2A4A] font-bold">
                  {" "}
                  careers@crystalicesenergies.ng
                </span>{" "}
                for future consideration.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Careers;
