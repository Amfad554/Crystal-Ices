import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";

// --- CENTRALIZED API CONFIG ---
const BASE_URL = "https://crystalbackend.onrender.com";

const Catalogue = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("All");
  const [equipment, setEquipment] = useState([]); // Now starts as empty array
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA FROM DATABASE ---
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        // Updated to use the live Render BASE_URL
        const res = await fetch(`${BASE_URL}/api/admin/equipment/all`);
        const json = await res.json();
        if (json.success) {
          setEquipment(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  // --- 2. SYNC FILTER WITH URL ---
  useEffect(() => {
    const categoryParam = searchParams.get("cat");
    if (categoryParam) {
      if (categoryParam === "Excavators" || categoryParam === "Cranes") {
        setFilter("Heavy Duty");
      } else if (categoryParam === "All Equipment") {
        setFilter("All");
      } else {
        setFilter(categoryParam);
      }
    }
  }, [searchParams]);

  // --- 3. FILTERING LOGIC ---
  const filteredItems = equipment.filter((item) => {
    const matchesFilter =
      filter === "All" || item.category?.toLowerCase() === filter.toLowerCase();
    const query = searchParams.get("query")?.toLowerCase() || "";
    const matchesQuery =
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));

    return matchesFilter && matchesQuery;
  });

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <section className="bg-[#0B2A4A] py-20 px-6 text-white border-b-4 border-[#00A3A3]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Equipment Catalogue
              </h1>
              <p className="text-gray-400 max-w-xl">
                Certified industrial machinery and infrastructure components
                synced from our live inventory.
              </p>
            </div>
            {searchParams.get("query") && (
              <div className="bg-[#00A3A3]/20 border border-[#00A3A3] p-2 rounded text-xs">
                Showing results for: "{searchParams.get("query")}"
              </div>
            )}
          </div>
        </section>

        <section className="py-12 px-6 max-w-7xl mx-auto">
          {/* Inventory Filters */}
          <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-100 pb-8">
            {["All", "Heavy Duty", "Oil & Gas", "Energy"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-tighter transition-all ${
                  filter === cat
                    ? "bg-[#0B2A4A] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalogue Grid */}
          {loading ? (
            <div className="text-center py-20 font-bold text-gray-400 animate-pulse">
              SYNCING WITH DATABASE...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group border border-gray-200 hover:border-[#00A3A3] transition-all duration-500"
                  >
                    <div className="aspect-video bg-gray-50 flex items-center justify-center text-6xl group-hover:bg-[#0B2A4A] group-hover:text-white transition-all duration-500 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>🚜</span>
                      )}
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-[#00A3A3] uppercase">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold italic ${
                            item.isAvailable
                              ? "text-emerald-500"
                              : "text-red-400"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "On Rent"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0B2A4A] mb-4 uppercase tracking-tight">
                        {item.name}
                      </h3>
                      <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                          <span className="text-gray-400 uppercase text-[10px] font-bold">
                            Brand
                          </span>
                          <span className="text-gray-700 font-medium">
                            {item.brand}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-400 uppercase text-[10px] font-bold">
                            Daily Rate
                          </span>
                          <span className="text-blue-600 font-bold">
                            {item.dailyRate
                              ? `$${item.dailyRate}`
                              : "Contact for Pricing"}
                          </span>
                        </div>
                      </div>
                      <button className="w-full bg-white border-2 border-[#0B2A4A] text-[#0B2A4A] py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#0B2A4A] hover:text-white transition-all">
                        Request Quote / Inspect
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-400">
                  No equipment found matching your criteria.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Catalogue;
