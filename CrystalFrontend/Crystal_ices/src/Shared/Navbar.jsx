import { useState } from "react";
import { NavLink } from "react-router-dom";
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
      {/* Container: Relative positioning is key for the absolute logo centering */}
      <div className="relative flex justify-between items-center w-full max-w-7xl mx-auto">
        {/* 1. Mobile Menu Toggle (Left) */}
        <div className="flex items-center lg:hidden z-20">
          <button
            className="text-white text-3xl"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <CiCircleRemove /> : <CiMenuFries />}
          </button>
        </div>

        {/* 2. Logo */}
        {/* Mobile: Absolute center | Desktop: Static left */}
        <div className="absolute left-1/2 -translate-x-1/2 transform lg:static lg:left-0 lg:translate-x-0 z-10">
          <NavLink to="/">
            <img
              src="/images/real_logo.png"
              alt="Logo"
              className="h-16 sm:h-20 md:h-14 lg:h-12 w-auto object-contain transition-all"
            />
          </NavLink>
        </div>

        {/* 3. Desktop Links (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-grow justify-center items-center space-x-1 xl:space-x-4">
          {navlinks.map((item) => (
            <NavLink key={item.id} to={item.path} className={linkStyles}>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* 4. Login Icon (Right) */}
        <div className="flex justify-end items-center z-20">
          <NavLink
            to="/auth"
            className="text-white flex items-center space-x-1 hover:text-blue-400 transition"
          >
            <CiLogin className="text-2xl md:text-3xl" />
            <span className="hidden sm:inline text-sm font-medium">Login</span>
          </NavLink>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay */}
      {/* Added a simple transition height/opacity logic could be added here */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0B2A4A] border-t border-blue-900 z-50 flex flex-col p-4 space-y-2 shadow-xl">
          {navlinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-400 font-bold p-3 bg-blue-950/50 rounded-lg"
                  : "text-gray-200 p-3"
              }
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
