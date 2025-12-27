import { useState } from "react"; 
import Layout from "../Shared/Layout/Layout";

// --- CENTRALIZED API CONFIG ---
const BASE_URL = "https://crystalbackend.onrender.com";

const News = () => {
  // 2. Setup state for email and loading status
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 3. Updated submit handler with Render URL
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter an email address");

    setLoading(true);
    try {
      // Updated to use the live Render BASE_URL
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
        {/* News Hero */}
        <section className="bg-[#0B2A4A] py-20 px-6 text-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#00A3A3] font-bold text-xs uppercase tracking-[0.3em] mb-4">Insights & Updates</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter max-w-3xl">
              Stay Informed on Energy & Infrastructure.
            </h1>
          </div>
        </section>

        <section className="py-16 px-6 max-w-7xl mx-auto">
          {/* Featured Article */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <div className="bg-gray-100 aspect-video rounded-2xl flex items-center justify-center text-7xl shadow-inner">
              🌍
            </div>
            <div>
              <span className="text-[#00A3A3] font-black text-xs uppercase bg-teal-50 px-3 py-1 rounded">Featured News</span>
              <h2 className="text-3xl font-bold text-[#0B2A4A] mt-4 mb-4 leading-tight">
                Expanding Our Footprint: New Operations Hub in the Niger Delta
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                As part of our 2026 strategic expansion, Crystal Ices Energies is establishing a 
                dedicated logistics and technical support base to better serve our offshore 
                and midstream partners...
              </p>
              <button className="text-[#0B2A4A] font-black text-sm border-b-2 border-[#0B2A4A] pb-1 hover:text-[#00A3A3] hover:border-[#00A3A3] transition-all">
                READ FULL STORY
              </button>
            </div>
          </div>

          <hr className="mb-20 border-gray-100" />

          {/* Latest News Grid */}
          <h3 className="text-2xl font-bold text-[#0B2A4A] mb-10">Latest Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {articles.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="bg-gray-50 aspect-video rounded-xl mb-6 flex items-center justify-center text-5xl group-hover:bg-gray-100 transition-colors">
                  {post.image}
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-[10px] font-bold text-[#00A3A3] uppercase tracking-widest">{post.category}</span>
                </div>
                <h4 className="text-xl font-bold text-[#0B2A4A] group-hover:text-[#00A3A3] transition-colors mb-3 leading-snug">
                  {post.title}
                </h4>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="bg-[#0B2A4A] py-16 px-6 mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Subscribe to our Industry Insights</h2>
            <p className="text-gray-400 mb-8 text-sm">Get the latest project updates and energy sector news delivered to your inbox.</p>
            
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="flex-1 px-6 py-3 rounded-none focus:outline-none text-black" 
              />
              <button 
                disabled={loading}
                type="submit"
                className="bg-[#00A3A3] text-white px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-teal-600 transition-colors disabled:opacity-50"
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