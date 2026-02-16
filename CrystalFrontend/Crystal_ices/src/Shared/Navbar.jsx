import { useState, useEffect, useCallback, useRef } from "react";
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

  // Session timeout duration (30 minutes in milliseconds)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // Change this value as needed
  const timeoutRef = useRef(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setIsLoggedIn(false);
    setIsOpen(false);
    window.dispatchEvent(new Event("auth-state-change"));
    navigate("/");
  }, [navigate]);

  const checkUserAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");
    
    // Check if session has expired
    if (token && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime);
      if (elapsed > SESSION_TIMEOUT) {
        // Session expired, log out
        handleLogout();
        return;
      }
    }
    
    setIsLoggedIn(!!token);
  }, [SESSION_TIMEOUT, handleLogout]);

  const resetTimeout = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      // Update last activity time
      localStorage.setItem("loginTime", Date.now().toString());
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        handleLogout();
        alert("Your session has expired. Please log in again.");
      }, SESSION_TIMEOUT);
    }
  }, [SESSION_TIMEOUT, handleLogout]);

  useEffect(() => {
    checkUserAuth();
    
    // Set up event listeners
    window.addEventListener("auth-state-change", checkUserAuth);
    window.addEventListener("storage", checkUserAuth);

    // Activity events to reset timeout
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimeout);
    });

    // Initial timeout setup
    resetTimeout();

    return () => {
      window.removeEventListener("auth-state-change", checkUserAuth);
      window.removeEventListener("storage", checkUserAuth);
      
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkUserAuth, resetTimeout, location]);

  const navlinks = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "About Us", path: "/about" },
    { id: 3, name: "Services", path: "/services" },
    { id: 4, name: "Project", path: "/project" },
    { id: 5, name: "Catalogue", path: "/catalogue" },
    { id: 6, name: "News", path: "/news" },
    { id: 7, name: "Careers", path: "/careers" },
    { id: 8, name: "Contact Us", path: "/contact" },
    { id: 9, name: "Privacy Policy", path: "/privacy" },
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