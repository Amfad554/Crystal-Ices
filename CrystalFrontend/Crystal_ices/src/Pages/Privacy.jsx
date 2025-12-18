import Layout from "../Shared/Layout/Layout";

const Privacy = () => {
  const sections = [
    {
      title: "Information Collection",
      content: "We collect information you provide directly to us, such as when you request a quote for equipment, apply for a career position, or contact our consultancy team. This may include your name, email, phone number, and company details."
    },
    {
      title: "Use of Information",
      content: "The information we collect is used to facilitate procurement orders, provide project management updates, and improve our service delivery in the energy and infrastructure sectors."
    },
    {
      title: "Data Security",
      content: "Crystal Ices Energies Nigeria Limited implements industry-standard security measures to protect your professional and personal data from unauthorized access or disclosure."
    },
    {
      title: "Third-Party Sharing",
      content: "We do not sell your data. We only share information with certified logistics partners or regulatory bodies (like NUPRC) when necessary to complete a project or maintain legal compliance."
    }
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <section className="bg-[#0B2A4A] py-16 px-6 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-[#00A3A3] text-sm font-bold uppercase tracking-widest">
              Last Updated: December 2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                At **Crystal Ices Energies Nigeria Limited**, we value your privacy. This policy 
                outlines how we handle information collected through our website and 
                corporate operations.
              </p>

              <div className="space-y-12">
                {sections.map((section, index) => (
                  <div key={index} className="border-l-4 border-gray-100 pl-6 hover:border-[#00A3A3] transition-colors">
                    <h2 className="text-xl font-bold text-[#0B2A4A] mb-4">
                      {index + 1}. {section.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#0B2A4A] mb-2">Questions?</h3>
                <p className="text-gray-600 text-sm">
                  If you have concerns about your data, please contact our legal and 
                  compliance department at 
                  <span className="text-[#00A3A3] font-bold"> info@crystalicesenergies.ng</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Privacy;