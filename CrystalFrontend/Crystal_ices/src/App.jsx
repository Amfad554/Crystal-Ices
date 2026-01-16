import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Increased to 4 seconds for a longer, more impactful branded intro
    const timer = setTimeout(() => setLoading(false), 4000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        <img
          src="/images/real_logo.png"
          alt="Crystal Ices Logo"
          style={logoStyle}
        />
        {/* Moderate, stylish branding text */}
        <h2 style={textStyle}>CRYSTAL ICES</h2>
      </div>
    );
  }

  return (
    <main>
      <Outlet />
    </main>
  );
}

// --- Styles ---

const spinnerContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#000000", // Sleek Black Background
};

const logoStyle = {
  width: "140px", // Slightly smaller logo to balance with the text
  height: "auto",
  marginBottom: "15px",
  filter: "drop-shadow(0px 0px 15px rgba(255, 255, 255, 0.3))", 
  animation: "bounce 1.5s infinite ease-in-out",
};

const textStyle = {
  color: "#ffffff",
  fontSize: "1.2rem",          // "Moderate" size (not too big)
  fontWeight: "600",           // Bold but clean
  letterSpacing: "6px",        // Stylish industrial spacing
  textTransform: "uppercase",  // Professional corporate look
  fontFamily: "sans-serif",
  opacity: "0.9",              // Slightly dimmed for a sophisticated look
  margin: "0"
};

export default App;