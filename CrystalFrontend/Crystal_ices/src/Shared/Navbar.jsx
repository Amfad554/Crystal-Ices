import { useState } from "react";
import { NavLink } from "react-router-dom";
// Changed CiCircleClose to CiCircleRemove
import { CiMenuFries, CiLogin, CiCircleRemove } from "react-icons/ci"; 

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
      <div className="grid grid-cols-3 lg:flex lg:justify-between items-center w-full max-w-7xl mx-auto">
        
        {/* 1. Mobile Menu Toggle (Left) */}
        <div className="flex items-center lg:hidden">
          <button 
            className="text-white text-3xl" // Increased size slightly for visibility
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Using CiCircleRemove instead of CiCircleClose */}
            {isOpen ? <CiCircleRemove /> : <CiMenuFries />}
          </button>
        </div>

        {/* 2. Logo (Center on Mobile, Left on Desktop) */}
        <div className="flex justify-center lg:justify-start lg:flex-shrink-0">
          <img src="/images/logo2.png" alt="Logo" className="h-10 md:h-16" />
        </div>

        {/* 3. Desktop Links (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-grow justify-center items-center space-x-2">
          {navlinks.map((item) => (
            <NavLink key={item.id} to={item.path} className={linkStyles}>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* 4. Login Icon (Right) */}
        <div className="flex justify-end items-center">
          <NavLink to="/auth" className="text-white flex items-center space-x-1 hover:text-blue-400 transition">
            <CiLogin className="text-2xl md:text-3xl" />
            <span className="hidden sm:inline text-sm font-medium">Login</span>
          </NavLink>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0B2A4A] border-t border-blue-900 z-50 flex flex-col p-4 space-y-2">
          {navlinks.map((item) => (
            <NavLink 
              key={item.id} 
              to={item.path} 
              className={linkStyles}
              onClick={() => setIsOpen(false)}
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