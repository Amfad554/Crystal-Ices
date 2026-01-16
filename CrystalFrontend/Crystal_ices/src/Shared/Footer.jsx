import { NavLink } from 'react-router-dom';

const Footer = () => {
  // Helper to keep the code clean for active styling
  const navLinkStyles = ({ isActive }) => 
    isActive ? "text-[#00A3A3] font-medium" : "hover:text-[#00A3A3] transition-colors";

  return (
    <footer className="bg-[#0B2A4A] text-gray-300 pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">

          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Crystal Ices Energies Nigeria Limited
            </h2>
            <p className="text-sm leading-relaxed mb-6">
              Consultancy, procurement and equipment solutions for oil & gas
              infrastructure, heavy machinery and industrial real estate.
            </p>
            <p className="text-sm">
              Ketu, Lagos, Nigeria
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li><NavLink to="/about" className={navLinkStyles}>About Us</NavLink></li>
              <li><NavLink to="/services" className={navLinkStyles}>Services</NavLink></li>
              <li><NavLink to="/project" className={navLinkStyles}>Projects</NavLink></li>
              <li><NavLink to="/catalogue" className={navLinkStyles}>Equipment Catalogue</NavLink></li>
              <li><NavLink to="/careers" className={navLinkStyles}>Careers</NavLink></li>
            </ul>
          </div>

          {/* Services - Static list or can be NavLinks too */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Our Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li>Consultancy & Project Management</li>
              <li>Oil & Gas Equipment Procurement</li>
              <li>Heavy Duty Machinery (Sales & Rental)</li>
              <li>Industrial & Energy Real Estate</li>
            </ul>
          </div>

          {/* Contact - Keep external links as <a> tags */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li>📞 +2348059477264</li>
              <li>
                <a
                  href="https://wa.me/+2348059477264"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00A3A3]"
                >
                  💬 Chat on WhatsApp
                </a>
              </li>
              <li>✉️ crystali@crystalicesenergies.ng</li>
              <li>⏰ Mon – Fri: 08:00 – 17:00</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Crystal Ices Energies Nigeria Limited. All rights reserved.
          </p>
          <div className="flex gap-6">
            <NavLink to="/privacy-policy" className={navLinkStyles}>
              Privacy Policy
            </NavLink>
            <NavLink to="/terms" className={navLinkStyles}>
              Terms & Conditions
            </NavLink>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;