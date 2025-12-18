import { useState } from "react";
import { NavLink } from "react-router-dom";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 

  const navlinks = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "About Us", path: "/about" },
    { id: 3, name: "Services", path: "/services" },
    { id: 4, name: "Project", path: "/project" },
    { id: 5, name: "Equipment Catalogue", path: "/catalogue" },
    { id: 6, name: "News", path: "/news" },
    { id: 7, name: "Careers", path: "/careers" },
    { id: 8, name: "Contact Us", path: "/contact" },
    { id: 9, name: "Privacy Policy", path: "/privacy" },
  ];

  const linkStyles = ({ isActive }) =>
    isActive
      ? "text-blue-400 font-semibold p-2 border-b-2 border-blue-400"
      : "text-gray-200 p-2 hover:text-white transition duration-75 text-sm";

  return (
    <nav className="bg-[#0B2A4A] p-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        

        <div className="flex-shrink-0">
          <img src="/images/logo2.png" alt="Logo" className="h-12 md:h-16" />
        </div>

        {/* 2. Desktop Navigation (Hidden on mobile) */}
        <div className="hidden lg:flex flex-grow justify-center items-center space-x-2">
          {navlinks.map((item) => (
            <NavLink key={item.id} to={item.path} className={linkStyles}>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* 3. Desktop Language Button & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          {/* Language Button (Visible on all screens) */}
          <button className="flex items-center space-x-2 border border-gray-400 text-gray-700 py-1 px-3 rounded-full bg-white">
            <span className="text-red-500 font-bold">+</span>
            <span className="text-sm font-medium">En</span>
            <span className="text-xs">▼</span>
          </button>

          {/* Mobile Hamburger Button (Visible only on mobile/tablet) */}
          <button 
            className="lg:hidden text-white" 
            onClick={() => setIsOpen(!isOpen)}
          >
          {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* 4. Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0B2A4A] border-t border-blue-900 z-50 flex flex-col p-4 space-y-2">
          {navlinks.map((item) => (
            <NavLink 
              key={item.id} 
              to={item.path} 
              className={linkStyles}
              onClick={() => setIsOpen(false)} // Close menu when a link is clicked
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;