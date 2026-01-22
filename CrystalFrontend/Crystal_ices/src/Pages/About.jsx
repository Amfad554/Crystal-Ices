import Layout from "../Shared/Layout/Layout";

const About = () => {
  const values = [
    {
      title: "Integrity",
      desc: "We conduct our business with the highest ethical standards, ensuring transparency in every contract.",
      icon: "⚖️",
    },
    {
      title: "Innovation",
      desc: "Utilizing modern technology and engineering solutions to solve complex energy challenges.",
      icon: "🚀",
    },
    {
      title: "Reliability",
      desc: "Consistently delivering high-quality equipment and consultancy services on schedule.",
      icon: "🤝",
    },
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Crystal Ices Energies Nigeria Limited is a premier indigenous
              multi-disciplinary firm providing world-class solutions to the oil
              & gas, construction, and real estate sectors.
            </p>
          </div>
        </section>

        {/* Company Profile Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-6">
              Who We Are
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Based in Lagos, Nigeria, we have grown into a trusted partner for
              major infrastructure projects. We bridge the gap between complex
              industrial needs and high-quality equipment procurement.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our expertise spans across consultancy, project management, and
              the sales/rental of heavy-duty machinery. We are committed to
              empowering the Nigerian energy sector with local expertise and
              global standards.
            </p>
          </div>
          <div className="bg-gray-100 h-80 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
            <img
              src="https://res.cloudinary.com/debum5mhu/image/upload/v1769094466/ceo_q0gojr.jpg"
              alt="CEO"
              className="w-[100%] h-[80%] object-cover object-top hover:scale-105 transition-transform duration-500"
            />
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className="py-16 bg-gray-50 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-sm border-t-4 border-[#00A3A3]">
              <h3 className="text-2xl font-bold text-[#0B2A4A] mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 italic">
                "To deliver innovative, reliable, and cost-effective energy and
                infrastructure solutions while maintaining the highest safety
                and environmental standards."
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border-t-4 border-[#0B2A4A]">
              <h3 className="text-2xl font-bold text-[#0B2A4A] mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 italic">
                "To be the leading indigenous partner for industrial growth in
                Africa, recognized for excellence in procurement and project
                delivery."
              </p>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0B2A4A] text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="text-5xl mb-4">{val.icon}</div>
                <h4 className="text-xl font-bold text-[#0B2A4A] mb-2">
                  {val.title}
                </h4>
                <p className="text-gray-600">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
