import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
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
  width: "160px", 
  height: "auto",
  marginBottom: "20px",
  // A slight white glow helps the logo stand out on black
  filter: "drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.2))", 
  animation: "bounce 1.5s infinite ease-in-out",
};


export default App;