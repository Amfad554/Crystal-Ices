import React, { useState, useEffect } from "react";

const EquipmentFleet = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/equipment")
      .then(res => res.json())
      .then(data => {
        if(data.success) setItems(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black mb-6">Machinery Catalog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? <p>Loading fleet...</p> : items.map(item => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="h-48 bg-slate-200">
               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">{item.category}</span>
              <h3 className="font-bold text-lg mt-2">{item.name}</h3>
              <p className="text-slate-500 text-xs mt-1 mb-4">{item.description}</p>
              <button className="w-full bg-[#0B2A4A] text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors">
                Request Inquiry
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentFleet;