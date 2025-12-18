import Layout from "../Shared/Layout/Layout";

const Contact = () => {
  // Encoded address for the Google Maps URL
  const mapAddress = "35 Ikosi Road, Ketu, Lagos, Nigeria";
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapAddress
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <section className="bg-[#0B2A4A] py-20 px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have a project in mind or need a quote for equipment? Our team is
            ready to provide the solutions you need.
          </p>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-[#0B2A4A] mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="text-2xl p-3 bg-gray-100 rounded-lg shadow-sm">
                    📍
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B2A4A]">Our Office</h4>
                    <p className="text-gray-600 text-sm">
                      35 Ikosi Road, Ketu, Lagos State, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl p-3 bg-gray-100 rounded-lg shadow-sm">
                    📞
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B2A4A]">Call Us</h4>
                    <p className="text-gray-600 text-sm">+234 XXX XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl p-3 bg-gray-100 rounded-lg shadow-sm">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B2A4A]">Email Us</h4>
                    <p className="text-gray-600 text-sm">
                      info@crystalicesenergies.ng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl p-3 bg-gray-100 rounded-lg shadow-sm">
                    💬
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B2A4A]">WhatsApp</h4>
                    <a
                      href="https://wa.me/234XXXXXXXXXX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00A3A3] font-medium hover:underline"
                    >
                      Chat with a representative
                    </a>
                  </div>
                </div>
              </div>

              {/* Live Google Map */}
              <div className="mt-12 h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <iframe
                  title="Crystal Ices Energies Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={mapSrc}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-gray-50 p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-[#0B2A4A] mb-6">
                Send Us a Message
              </h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A3A3] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A3A3] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Required
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A3A3] outline-none transition-all appearance-none bg-white">
                    <option>Equipment Procurement</option>
                    <option>Consultancy</option>
                    <option>Machinery Rental</option>
                    <option>Real Estate Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows="4"
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00A3A3] outline-none transition-all"
                  ></textarea>
                </div>

                <button className="w-full bg-[#0B2A4A] text-white font-bold py-4 rounded-lg hover:bg-[#00A3A3] transition-all shadow-lg active:scale-[0.98]">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
