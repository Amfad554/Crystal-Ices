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

  // 1. Wrapped in useCallback to prevent "checkUserAuth" changing on every render
  const checkUserAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Initial check
    checkUserAuth();

    // LISTEN FOR THE SIGNALS
    window.addEventListener("auth-state-change", checkUserAuth);
    window.addEventListener("storage", checkUserAuth);

    return () => {
      window.removeEventListener("auth-state-change", checkUserAuth);
      window.removeEventListener("storage", checkUserAuth);
    };
  }, [checkUserAuth, location]); // location added here to re-check on every route change

  // 2. Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
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
    <nav className="bg-[#0B2A4A] p-4 shadow-md sticky top-0 z-50">
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

        {/* DYNAMIC AUTH ICON */}
        <div className="flex justify-end items-center z-20 gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <NavLink
                to="/admin/dashboard"
                className="text-white flex items-center space-x-2 bg-[#00A3A3]/20 px-3 py-1.5 rounded-lg border border-[#00A3A3] hover:bg-[#00A3A3] transition-all"
              >
                <CiGrid41 className="text-2xl" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">
                  Dashboard
                </span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <CiLogout className="text-2xl" />
              </button>
            </div>
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
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0B2A4A] border-t border-blue-900 z-50 flex flex-col p-4 space-y-2 shadow-xl">
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
              className="text-red-400 p-3 text-left font-bold flex items-center gap-2"
            >
              <CiLogout /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;