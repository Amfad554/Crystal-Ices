import { NavLink } from 'react-router-dom';
// Import the icons
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const navLinkStyles = ({ isActive }) => 
    isActive ? "text-[#00A3A3] font-medium" : "hover:text-[#00A3A3] transition-colors";

  // Social Link Component for reusability
  const SocialLink = ({ href, icon: Icon, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-800 p-2 rounded-full hover:bg-[#00A3A3] hover:text-white transition-all duration-300 text-gray-400"
      aria-label={label}
    >
      <Icon size={18} />
    </a>
  );

  return (
    <footer className="bg-[#0B2A4A] text-gray-300 pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">

          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Crystal Ices Energies
            </h2>
            <p className="text-sm leading-relaxed mb-6">
              Consultancy, procurement and equipment solutions for oil & gas
              infrastructure, heavy machinery and industrial real estate.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <SocialLink href="https://www.linkedin.com/in/crystalices-energies-limited-8838a93a7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" icon={Linkedin} label="LinkedIn" />
              <SocialLink href="https://web.facebook.com/profile.php?id=61586883942940" icon={Facebook} label="Facebook" />
              <SocialLink href="https://x.com/crystalices10" icon={Twitter} label="X (Twitter)" />
              <SocialLink href="https://www.instagram.com/crystalices_energies/" icon={Instagram} label="Instagram" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
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

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Our Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white transition-colors cursor-default">Consultancy & Project Management</li>
              <li className="hover:text-white transition-colors cursor-default">Oil & Gas Equipment Procurement</li>
              <li className="hover:text-white transition-colors cursor-default">Heavy Duty Machinery</li>
              <li className="hover:text-white transition-colors cursor-default">Industrial & Energy Real Estate</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li>📞 +234 805 947 7264</li>
              <li>
                <a
                  href="https://wa.me/+2348059477264"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#00A3A3] transition-colors"
                >
                  <span className="text-lg">💬</span> Chat on WhatsApp
                </a>
              </li>
              <li className="break-all">✉️ crystalices10@gmail.com</li>
              <li>📍 12 Oshokoya, Ketu, Lagos State, Nigeria</li>
              <li>⏰ Mon – Fri: 08:00 – 17:00</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Crystal Ices Energies Nigeria Limited.
          </p>
          <div className="flex gap-6">
            <NavLink to="/privacy-policy" className="hover:text-[#00A3A3]">Privacy Policy</NavLink>
            <NavLink to="/terms" className="hover:text-[#00A3A3]">Terms & Conditions</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;