import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

const BASE_URL = "https://crystalbackend.onrender.com";

const News = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null); // Modal state
  const [subscribeStatus, setSubscribeStatus] = useState(null); // Success/Error msg

  const articles = [
    {
      id: 1,
      date: "Dec 12, 2025",
      category: "Milestone",
      title: "Crystal Ices Completes Major Valve Procurement for Port Harcourt Refinery",
      excerpt: "Our technical team successfully delivered a specialized batch of API-certified high-pressure valves, supporting the national refinery rehabilitation initiative.",
      content: "The delivery included 45 high-pressure isolation valves and gate valves specifically designed for the harsh environments of refinery operations. Our team oversaw the logistics from Onne Port to the project site, ensuring all technical certifications were met prior to installation. This milestone reinforces Crystal Ices as a Tier-1 procurement partner for Nigeria's oil and gas infrastructure.",
      image: "🚢"
    },
    {
      id: 2,
      date: "Nov 28, 2025",
      category: "Industry",
      title: "The Future of LPG Infrastructure in Nigeria: 2026 Outlook",
      excerpt: "Analyzing the shift towards cleaner energy and the growing demand for local bottling plant infrastructure across the Southwestern region.",
      content: "With the Federal Government's 'Decade of Gas' initiative, we are seeing a 40% increase in inquiries for LPG bottling plant set-ups. Crystal Ices is currently consulting on three new sites in Ogun and Lagos states, providing end-to-end technical surveys and licensing support.",
      image: "🔥"
    },
    {
      id: 3,
      date: "Equipment",
      category: "Equipment",
      title: "Expanding Our Fleet: New 50-Ton Cranes Now Available for Rental",
      excerpt: "To meet the rising demand in the construction sector, we have added three new Liebherr mobile cranes to our Ketu-based fleet.",
      content: "These new additions feature a 52-meter telescopic boom and advanced safety systems, making them ideal for high-rise steel assembly and refinery maintenance. Available for both short-term and long-term lease starting immediately.",
      image: "🏗️"
    },
    {
      id: 4,
      date: "Oct 30, 2025",
      category: "Corporate",
      title: "Crystal Ices Energies Achieves New Safety Compliance Standards",
      excerpt: "We are proud to announce our latest certification in HSE management, reinforcing our commitment to zero-accident project sites.",
      content: "Safety is our license to operate. This new certification specifically covers high-risk operations including heavy lifting and high-pressure system maintenance. Our goal remains zero Lost Time Injuries (LTI) across all client sites.",
      image: "🛡️"
    }
  ];

  const categories = ["All", "Milestone", "Industry", "Equipment", "Corporate"];

  const filteredArticles = activeCategory === "All" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubscribeStatus(null);
    try {
      const res = await fetch(`${BASE_URL}/api/users/newsletter-subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSubscribeStatus({ type: 'success', msg: "Thank you for joining!" });
        setEmail("");
      } else {
        setSubscribeStatus({ type: 'error', msg: data.message || "Try again later." });
      }
    } catch (err) {
      setSubscribeStatus({ type: 'error', msg: "Connection failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#00A3A3] font-bold text-sm uppercase tracking-widest mb-4">Insights & Updates</p>
            <h1 className="text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
              Stay Informed on Energy & Infrastructure.
            </h1>
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          {/* Featured Article */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
            <div className="bg-gray-100 aspect-video rounded-3xl flex items-center justify-center text-8xl shadow-inner border border-gray-100 transition-transform hover:scale-[1.01]">
              🌍
            </div>
            <div>
              <span className="text-[#00A3A3] font-semibold text-sm uppercase tracking-wide">Featured News</span>
              <h2 className="text-3xl font-bold text-[#0B2A4A] mt-4 mb-6 leading-tight">
                Expanding Our Footprint: New Operations Hub in the Niger Delta
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Crystal Ices Energies is establishing a dedicated logistics base to better serve 
                our offshore and midstream partners in the South-South region.
              </p>
              <button 
                onClick={() => setSelectedArticle({
                    title: "Expanding Our Footprint: New Operations Hub in the Niger Delta",
                    category: "Featured",
                    content: "This new hub will feature a 5,000 sqm warehouse for equipment storage and a dedicated technical workshop. By being physically closer to the Niger Delta's major oil terminals, we can reduce response times for our clients by over 60%.",
                    image: "🌍"
                })}
                className="bg-[#0B2A4A] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00A3A3] transition-all"
              >
                Read Full Story
              </button>
            </div>
          </div>

          <hr className="mb-24 border-gray-100" />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${
                  activeCategory === cat 
                  ? "bg-[#00A3A3] text-white border-[#00A3A3]" 
                  : "bg-white text-gray-400 border-gray-200 hover:border-[#0B2A4A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Latest News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((post) => (
              <div 
                key={post.id} 
                className="group flex flex-col cursor-pointer"
                onClick={() => setSelectedArticle(post)}
              >
                <div className="bg-gray-50 aspect-video rounded-2xl mb-6 flex items-center justify-center text-5xl border border-gray-100 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  {post.image}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-[#00A3A3] uppercase">{post.category}</span>
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
                  <span className="text-[#0B2A4A] font-bold text-sm flex items-center gap-2">
                    Read More <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- ARTICLE MODAL --- */}
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-8 md:p-12 relative">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-black text-2xl"
                >✕</button>
                <span className="text-xs font-bold text-[#00A3A3] uppercase tracking-widest">{selectedArticle.category}</span>
                <h2 className="text-3xl font-bold text-[#0B2A4A] mt-2 mb-6">{selectedArticle.title}</h2>
                <div className="bg-gray-50 p-10 rounded-2xl flex items-center justify-center text-7xl mb-8">
                    {selectedArticle.image}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </p>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="mt-10 w-full bg-[#0B2A4A] text-white py-4 rounded-xl font-bold hover:bg-[#00A3A3] transition-colors"
                >Close Article</button>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Section */}
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
                className="flex-1 px-6 py-4 rounded-xl focus:outline-none text-black border-2 border-transparent focus:border-[#00A3A3] transition-all shadow-lg" 
              />
              <button 
                disabled={loading}
                type="submit"
                className="bg-[#00A3A3] text-white px-10 py-4 rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join"}
              </button>
            </form>
            
            {subscribeStatus && (
              <p className={`mt-6 font-bold ${subscribeStatus.type === 'success' ? 'text-teal-400' : 'text-red-400'}`}>
                {subscribeStatus.msg}
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default News;