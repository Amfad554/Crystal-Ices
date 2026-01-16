import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";

const BASE_URL = "https://crystalbackend.onrender.com";

const Catalogue = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("All");
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
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
        {/* Header Section - Aligned with About & Project */}
        <section className="bg-[#0B2A4A] py-24 px-6 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Equipment Catalogue</h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Certified industrial machinery and infrastructure components synced from our live inventory.
              </p>
            </div>
            {searchParams.get("query") && (
              <div className="bg-[#00A3A3] px-4 py-2 rounded-lg text-sm font-medium">
                Results for: "{searchParams.get("query")}"
              </div>
            )}
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          {/* Inventory Filters - Aligned with Project page buttons */}
          <div className="flex flex-wrap gap-3 mb-16 justify-center md:justify-start">
            {["All", "Heavy Duty", "Oil & Gas", "Energy"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all border ${
                  filter === cat
                    ? "bg-[#00A3A3] text-white border-[#00A3A3]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#00A3A3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalogue Grid */}
          {loading ? (
            <div className="text-center py-20 text-xl font-medium text-gray-400 animate-pulse">
              Syncing with database...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-video bg-gray-50 flex items-center justify-center relative overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-6xl">🚜</span>
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        item.isAvailable ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                      }`}>
                        {item.isAvailable ? "Available" : "On Rent"}
                      </div>
                    </div>

                    <div className="p-8">
                      <p className="text-[#00A3A3] font-semibold text-sm uppercase tracking-wide mb-2">
                        {item.category}
                      </p>
                      <h3 className="text-2xl font-bold text-[#0B2A4A] mb-6">
                        {item.name}
                      </h3>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                          <span className="text-gray-400 font-medium">Brand</span>
                          <span className="text-gray-800 font-bold">{item.brand}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                          <span className="text-gray-400 font-medium">Daily Rate</span>
                          <span className="text-[#0B2A4A] font-extrabold text-lg">
                            {item.dailyRate ? `₦${item.dailyRate.toLocaleString()}` : "Enquire"}
                          </span>
                        </div>
                      </div>

                      <button className="w-full bg-[#0B2A4A] text-white py-4 rounded-xl font-bold hover:bg-[#00A3A3] transition-all shadow-md">
                        Request Quote
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-500 text-lg">
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