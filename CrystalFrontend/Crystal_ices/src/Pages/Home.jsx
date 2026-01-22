/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"; // Added useRef
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";


// --- CENTRALIZED API CONFIG ---
const BASE_URL = "https://crystalbackend.onrender.com";

// --- IMAGE IMPORTS ---
import slide1 from "/images/oil.jpg";
import slide2 from "/images/machine.jpg";
import slide3 from "/images/refinary2.jpg";
import slide4 from "/images/construction2.avif";
import slide5 from "/images/building2.jpeg"


const Home = () => {
  const navigate = useNavigate();

  // --- 1. STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    category: "All Equipment",
    region: "Lagos Mainland",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    service: "Heavy Machinery Procurement",
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const chatEndRef = useRef(null);

  // --- 2. DATA ARRAYS ---
  const sliderData = [
    {
      img: slide1,
      title: "Energy Solutions",
      desc: "Strategic procurement for oil & gas facilities.",
    },
    {
      img: slide2,
      title: "Heavy Machinery",
      desc: "Top-tier excavators and plant equipment leasing.",
    },
    {
      img: slide3,
      title: "Refining Excellence",
      desc: "Consultancy for modern refinery operations.",
    },
    {
      img: slide4,
      title: "Infrastructure",
      desc: "Building the future of industrial real estate.",
    },
    {
      img: slide5,
      title: "Real Estate",
      desc: "Building the future of industrial real estate.",
    },
  ];

  const staffMembers = [
    {
      name: "Engr. Ikechukwu Opia",
      role: "CEO & Founder",
      specialty: "Energy Infrastructure",
      img: "https://res.cloudinary.com/debum5mhu/image/upload/v1769094466/ceo_q0gojr.jpg",
    },
    {
      name: "George Chiamaka",
      role: "Director of Research & Development",
      specialty: "Global Supply Chain",
      img: "https://res.cloudinary.com/debum5mhu/image/upload/v1769094441/staff_xitwfj.jpg",
    },
    {
      name: "Marcus Tunde",
      role: "Project Manager",
      specialty: "Heavy Machinery",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500",
    },
    {
      name: "Chioma Williams",
      role: "Legal Compliance",
      specialty: "Regulatory Affairs",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=500",
    },
  ];

  // --- 3. EFFECTS & HANDLERS ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === sliderData.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []); // Empty array is fine now because sliderData is static and outside the effect

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: searchQuery.keyword,
      cat: searchQuery.category,
      loc: searchQuery.region,
    }).toString();
    navigate(`/catalogue?${params}`);
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      ...formData,
      userId: user ? user.id : null,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/inquiry/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          service: "Heavy Machinery Procurement",
          requirements: "",
        });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      .:::::
      <main className="min-h-screen font-sans text-slate-900 bg-white relative">
        {/* --- 1. HERO SECTION --- */}
        <section className="pt-24 pb-20 bg-slate-900 text-white px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <span className="inline-block py-1 px-4 mb-6 text-xs font-bold tracking-[0.3em] text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
              Lagos Premier Industrial Partner
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              End-to-end Consultancy & Procurement{" "}
              <br className="hidden md:block" />
              for Energy & Heavy Machinery
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
              From pump stations and jetties to specialized excavators and
              industrial real estate. We combine local Lagos expertise with
              global supply chains.
            </p>

            <div className="flex flex-wrap justify-center gap-5 mb-16">
              <a
                href="#quotation-section"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95"
              >
                Request a Quote
              </a>
              <Link
                to="/catalogue"
                className="border border-slate-700 text-slate-300 hover:bg-white hover:text-slate-900 px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
              >
                View Equipment Catalogue
              </Link>
            </div>

            {/* HERO SLIDER */}
            <div className="relative w-full max-w-6xl h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
              {sliderData.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                >
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-8 md:p-20 text-left">
                    <h3 className="text-2xl md:text-4xl font-bold mb-3">
                      {slide.title}
                    </h3>
                    <p className="text-sm md:text-lg text-slate-300 max-w-xl opacity-90">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-10 right-10 flex gap-3 z-20">
                {sliderData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 transition-all rounded-full ${
                      i === currentSlide
                        ? "w-12 bg-blue-500"
                        : "w-4 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. EQUIPMENT QUICK SEARCH --- */}
        <div className="relative z-30 -mt-12 px-6">
          <form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-4 md:p-6 border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">
                Keywords
              </label>
              <input
                type="text"
                placeholder="Search machinery..."
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                value={searchQuery.keyword}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, keyword: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">
                Category
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-slate-500 text-sm"
                value={searchQuery.category}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, category: e.target.value })
                }
              >
                <option>All Equipment</option>
                <option>Excavators</option>
                <option>Cranes</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">
                Region
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-slate-500 text-sm"
                value={searchQuery.region}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, region: e.target.value })
                }
              >
                <option>Lagos Mainland</option>
                <option>Lagos Island</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest mt-auto mb-1 h-[48px] transition-all"
            >
              Search Now
            </button>
          </form>
        </div>

        {/* --- 3. TRUST BAR --- */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Compliance", val: "Registered in Nigeria" },
              { label: "Quality", val: "ISO-Ready Processes" },
              { label: "Timeline", val: "Fast Turnaround" },
              { label: "Support", val: "Local Lagos Presence" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col border-l-2 border-blue-600 pl-6"
              >
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">
                  {item.label}
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- 4. SERVICES TILES --- */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Expertise</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Consultancy",
                icon: "📊",
                desc: "Technical guidance on energy infrastructure.",
              },
              {
                title: "Oil & Gas",
                icon: "⛽",
                desc: "Managing pump stations and jetty terminals.",
              },
              {
                title: "Heavy Machinery",
                icon: "🏗️",
                desc: "Strategic procurement of plant equipment.",
              },
              {
                title: "Real Estate",
                icon: "🏠",
                desc: "Industrial and residential development.",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="p-10 border border-white rounded-[2rem] hover:shadow-2xl transition-all duration-500 bg-white group cursor-default"
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="font-bold text-xl mb-4 text-slate-800">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- 5. FEATURED PROJECTS --- */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-bold text-slate-900">
                Featured Projects
              </h2>
              <Link
                to="/projects"
                className="text-blue-600 font-bold text-sm uppercase tracking-widest border-b-2 border-blue-600 pb-1 hover:text-blue-800 hover:border-blue-800 transition-colors inline-block"
              >
                All Projects
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Refinery Logistics",
                  tags: "Oil & Gas",
                  result: "30% Efficiency Boost",
                  img: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=800",
                },
                {
                  title: "Jetty Infrastructure",
                  tags: "Maritime",
                  result: "Safety Compliant",
                  img: "https://images.unsplash.com/photo-1521510895919-46920266ddb3?auto=format&fit=crop&q=80&w=800",
                },
                {
                  title: "Real Estate Development",
                  tags: "Construction",
                  result: "24-Hour Deployment",
                  img: "https://res.cloudinary.com/debum5mhu/image/upload/v1769094589/building5_ra9tmx.jpg",
                },
              ].map((project, i) => (
                <div
                  key={i}
                  className="group relative h-80 rounded-3xl overflow-hidden border border-slate-200 p-8 flex flex-col justify-end hover:shadow-2xl transition-all cursor-pointer"
                >
                  <img
                    src={project.img}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 block">
                      {project.tags}
                    </span>
                    <h4 className="text-xl font-bold text-white mb-1">
                      {project.title}
                    </h4>
                    <p className="text-sm text-slate-300">{project.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 6. STAFF / LEADERSHIP --- */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em]">
                The Human Capital
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Expertise Driven by Experience
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {staffMembers.map((member, i) => (
                <div key={i} className="group">
                  <div className="relative h-96 overflow-hidden rounded-[2rem] mb-6 shadow-lg">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <p className="text-white text-xs font-medium tracking-wide">
                        Specializing in{" "}
                        <span className="text-blue-400 font-bold">
                          {member.specialty}
                        </span>
                      </p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    {member.name}
                  </h4>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-widest">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 7. QUOTATION SECTION (FUNCTIONAL) --- */}
        <section
          id="quotation-section"
          className="relative py-32 px-6 overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <img
              src={slide3}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/70"></div>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="text-white">
              <span className="inline-block py-1 px-3 mb-6 text-xs font-bold tracking-[0.2em] text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
                Direct Technical Channel
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">
                Request a Professional <br />{" "}
                <span className="text-blue-400">Quotation</span>
              </h2>
              <p className="text-slate-300 text-lg mb-12 max-w-lg leading-relaxed">
                Our engineering team provides technical procurement plans within
                24 hours.
              </p>
              <div className="space-y-6">
                {[
                  "Official Lagos Registered Entity",
                  "Global Supply Chain Partnerships",
                  "Strict ISO-Ready Compliance",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <span className="text-sm font-bold">✓</span>
                    </div>
                    <span className="text-slate-200 font-medium tracking-wide">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  Inquiry Portal
                </h3>
                <p className="text-slate-500 text-sm">
                  Please fill out technical fields.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    ✓
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900">
                    Message Received
                  </h4>
                  <p className="text-slate-500 mt-2">
                    Our engineers are reviewing your requirements.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <select
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none text-sm text-slate-500"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                  >
                    <option>Heavy Machinery Procurement</option>
                    <option>Oil & Gas Consultancy</option>
                    <option>Industrial Real Estate</option>
                  </select>
                  <textarea
                    required
                    placeholder="Technical Requirements..."
                    rows="3"
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none resize-none text-sm"
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                  ></textarea>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Submit Official Inquiry"}{" "}
                    <span>→</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
