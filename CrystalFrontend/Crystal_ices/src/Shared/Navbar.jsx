import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  CiMenuFries,
  CiLogin,
  CiCircleRemove,
  CiGrid41,
  CiLogout,
} from "react-icons/ci";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    checkUserAuth();
    window.addEventListener("auth-state-change", checkUserAuth);
    window.addEventListener("storage", checkUserAuth);

    return () => {
      window.removeEventListener("auth-state-change", checkUserAuth);
      window.removeEventListener("storage", checkUserAuth);
    };
  }, [checkUserAuth, location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clean up user data too
    setIsLoggedIn(false);
    setIsOpen(false);
    window.dispatchEvent(new Event("auth-state-change"));
    navigate("/");
  };

  const navlinks = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "About Us", path: "/about" },
    { id: 3, name: "Services", path: "/services" },
    { id: 4, name: "Project", path: "/project" },
    { id: 5, name: "Catalogue", path: "/catalogue" },
    { id: 6, name: "News", path: "/news" },
    { id: 7, name: "Careers", path: "/careers" },
    { id: 8, name: "Contact Us", path: "/contact" },
  ];

  const linkStyles = ({ isActive }) =>
    isActive
      ? "text-[#00A3A3] font-semibold p-2 border-b-2 border-[#00A3A3] text-sm"
      : "text-gray-200 p-2 hover:text-white transition duration-75 text-sm font-medium";

  return (
    /* Increased z-index to z-[100] to ensure it stays on top */
    <nav className="bg-[#0B2A4A] p-4 shadow-md sticky top-0 z-[100]">
      <div className="relative flex justify-between items-center w-full max-w-7xl mx-auto">
        {/* Mobile Menu Toggle */}
        <div className="flex items-center lg:hidden z-20">
          <button
            className="text-white text-3xl"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <CiCircleRemove /> : <CiMenuFries />}
          </button>
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 transform lg:static lg:left-0 lg:translate-x-0 z-10">
          <NavLink to="/">
            <img
              src="/images/real_logo.png"
              alt="Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-all"
            />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-grow justify-center items-center space-x-1 xl:space-x-4">
          {navlinks.map((item) => (
            <NavLink key={item.id} to={item.path} className={linkStyles}>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* DYNAMIC AUTH SECTION */}
        <div className="flex justify-end items-center z-20">
          {isLoggedIn ? (
            /* Updated to /dashboard and removed the extra logout button */
            <NavLink
              to="/dashboard"
              className="text-white flex items-center space-x-2 bg-[#00A3A3] px-4 py-2 rounded-lg hover:bg-[#008b8b] transition-all shadow-lg active:scale-95"
            >
              <CiGrid41 className="text-xl md:text-2xl" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">
                Dashboard
              </span>
            </NavLink>
          ) : (
            <NavLink
              to="/auth"
              className="text-white flex items-center space-x-2 hover:text-[#00A3A3] transition-all"
            >
              <CiLogin className="text-2xl md:text-3xl" />
              <span className="hidden sm:inline text-sm font-medium">
                Login
              </span>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0B2A4A] border-t border-blue-900 z-[101] flex flex-col p-4 space-y-2 shadow-xl">
          {navlinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-[#00A3A3] font-bold p-3 bg-blue-950/50 rounded-lg"
                  : "text-gray-200 p-3"
              }
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-red-400 p-3 text-left font-bold flex items-center gap-2 border-t border-blue-900 mt-2"
            >
              <CiLogout className="text-xl" /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
