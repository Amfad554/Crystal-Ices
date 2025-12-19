import { useState, useEffect } from "react"; // Added useEffect
import { useSearchParams } from "react-router-dom"; // Added this hook
import Layout from "../Shared/Layout/Layout";

const Catalogue = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("All");

  // --- LOGIC: Sync Filter with URL Parameters ---
  useEffect(() => {
    const categoryParam = searchParams.get("cat");
    // eslint-disable-next-line no-unused-vars
    const queryParam = searchParams.get("query");

    if (categoryParam) {
      // Map Home page categories to Catalogue categories
      if (categoryParam === "Excavators" || categoryParam === "Cranes") {
        setFilter("Heavy Duty");
      } else if (categoryParam === "All Equipment") {
        setFilter("All");
      } else {
        setFilter(categoryParam);
      }
    }
  }, [searchParams]);

  const equipment = [
    {
      id: 1,
      name: "Caterpillar 320 GC Excavator",
      category: "Heavy Duty",
      specs: "20-ton | 145 HP",
      purpose: "Earthmoving & Trenching",
      availability: "For Rent & Sale",
      icon: "🚜",
    },
    {
      id: 2,
      name: "Industrial Centrifugal Pump",
      category: "Oil & Gas",
      specs: "High Pressure | Stainless Steel",
      purpose: "Fluid Transport",
      availability: "In Stock",
      icon: "⚙️",
    },
    {
      id: 3,
      name: "Mobile Crane (50 Ton)",
      category: "Heavy Duty",
      specs: "Telescopic Boom | 4x4 Drive",
      purpose: "Lifting & Installation",
      availability: "Rental Only",
      icon: "🏗️",
    },
    {
      id: 4,
      name: "Power Generator (500kVA)",
      category: "Energy",
      specs: "Silent Diesel Engine",
      purpose: "Industrial Power Supply",
      availability: "For Sale",
      icon: "⚡",
    },
    {
      id: 5,
      name: "Piping & Valve Assemblies",
      category: "Oil & Gas",
      specs: "Grade A Steel | API Certified",
      purpose: "Refinery Infrastructure",
      availability: "Custom Order",
      icon: "🛡️",
    },
    {
      id: 6,
      name: "Articulated Dump Truck",
      category: "Heavy Duty",
      specs: "30-ton Payload",
      purpose: "Material Hauling",
      availability: "In Stock",
      icon: "🚛",
    },
  ];

  // Logic to handle both Category filter AND Search query text
  const filteredItems = equipment.filter((item) => {
    const matchesFilter = filter === "All" || item.category === filter;
    const query = searchParams.get("query")?.toLowerCase() || "";
    const matchesQuery =
      item.name.toLowerCase().includes(query) ||
      item.purpose.toLowerCase().includes(query);

    return matchesFilter && matchesQuery;
  });

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header - Identical to yours */}
        <section className="bg-[#0B2A4A] py-20 px-6 text-white border-b-4 border-[#00A3A3]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Equipment Catalogue
              </h1>
              <p className="text-gray-400 max-w-xl">
                Certified industrial machinery and oil & gas infrastructure
                components.
              </p>
            </div>
            {/* Show an active search indicator if coming from Home */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group border border-gray-200 hover:border-[#00A3A3] transition-all duration-500"
                >
                  <div className="aspect-video bg-gray-50 flex items-center justify-center text-6xl group-hover:bg-[#0B2A4A] group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-[#00A3A3] uppercase">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 italic">
                        {item.availability}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0B2A4A] mb-4 uppercase tracking-tight">
                      {item.name}
                    </h3>
                    <div className="space-y-3 mb-8">
                      <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                        <span className="text-gray-400 uppercase text-[10px] font-bold">
                          Specifications
                        </span>
                        <span className="text-gray-700 font-medium">
                          {item.specs}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-400 uppercase text-[10px] font-bold">
                          Primary Use
                        </span>
                        <span className="text-gray-700 font-medium">
                          {item.purpose}
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
        </section>
      </div>
    </Layout>
  );
};

export default Catalogue;
