import AIChat from "../AIChat/AIChat";
import Footer from "../Footer";
import Navbar from "../Navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
      <AIChat/>
    </div>
  );
};

export default Layout;