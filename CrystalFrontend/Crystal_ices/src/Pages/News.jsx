import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const BASE_URL = "https://crystalbackend.onrender.com";

const News = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter an email address");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/newsletter-subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Success! You've joined our newsletter.");
        setEmail("");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log(err);
      
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const articles = [
    {
      id: 1,
      date: "Dec 12, 2025",
      category: "Milestone",
      title: "Crystal Ices Completes Major Valve Procurement for Port Harcourt Refinery",
      excerpt: "Our technical team successfully delivered a specialized batch of API-certified high-pressure valves, supporting the national refinery rehabilitation initiative.",
      image: "🚢"
    },
    {
      id: 2,
      date: "Nov 28, 2025",
      category: "Industry",
      title: "The Future of LPG Infrastructure in Nigeria: 2026 Outlook",
      excerpt: "Analyzing the shift towards cleaner energy and the growing demand for local bottling plant infrastructure across the Southwestern region.",
      image: "🔥"
    },
    {
      id: 3,
      date: "Nov 15, 2025",
      category: "Equipment",
      title: "Expanding Our Fleet: New 50-Ton Cranes Now Available for Rental",
      excerpt: "To meet the rising demand in the construction sector, we have added three new Liebherr mobile cranes to our Ketu-based fleet.",
      image: "🏗️"
    },
    {
      id: 4,
      date: "Oct 30, 2025",
      category: "Corporate",
      title: "Crystal Ices Energies Achieves New Safety Compliance Standards",
      excerpt: "We are proud to announce our latest certification in HSE management, reinforcing our commitment to zero-accident project sites.",
      image: "🛡️"
    }
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section - Aligned with Project/Catalogue */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#00A3A3] font-bold text-sm uppercase tracking-widest mb-4">Insights & Updates</p>
            <h1 className="text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
              Stay Informed on Energy & Infrastructure.
            </h1>
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          {/* Featured Article - Aligned with Who We Are section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
            <div className="bg-gray-50 aspect-video rounded-2xl flex items-center justify-center text-8xl border border-gray-100 shadow-sm">
              🌍
            </div>
            <div>
              <span className="text-[#00A3A3] font-semibold text-sm uppercase tracking-wide">Featured News</span>
              <h2 className="text-3xl font-bold text-[#0B2A4A] mt-4 mb-6 leading-tight">
                Expanding Our Footprint: New Operations Hub in the Niger Delta
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                As part of our 2026 strategic expansion, Crystal Ices Energies is establishing a 
                dedicated logistics and technical support base to better serve our offshore 
                and midstream partners in the South-South region.
              </p>
              <button className="bg-[#0B2A4A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#00A3A3] transition-all shadow-md">
                Read Full Story
              </button>
            </div>
          </div>

          <hr className="mb-24 border-gray-100" />

          {/* Latest News Grid - Aligned with Project Cards */}
          <h3 className="text-3xl font-bold text-[#0B2A4A] mb-12">Latest Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((post) => (
              <div key={post.id} className="group flex flex-col">
                <div className="bg-gray-50 aspect-video rounded-2xl mb-6 flex items-center justify-center text-5xl border border-gray-100 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                  {post.image}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-[#00A3A3] uppercase tracking-wider">{post.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-medium text-gray-500">{post.date}</span>
                </div>
                <h4 className="text-xl font-bold text-[#0B2A4A] mb-4 leading-snug group-hover:text-[#00A3A3] transition-colors">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <button className="text-[#0B2A4A] font-bold text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                    Read More <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter - Aligned with Careers/Catalogue CTA style */}
        <section className="bg-[#0B2A4A] py-24 px-6 mt-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Subscribe to our Industry Insights</h2>
            <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto">
              Get the latest project updates and energy sector news delivered to your inbox.
            </p>
            
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-xl focus:outline-none text-black border-2 border-transparent focus:border-[#00A3A3] transition-all" 
              />
              <button 
                disabled={loading}
                type="submit"
                className="bg-[#00A3A3] text-white px-10 py-4 rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default News;