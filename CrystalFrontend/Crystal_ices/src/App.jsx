import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // 2.5s for a nice branded intro
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        {/* The Bouncing Logo */}
        <img 
          src="/images/real_logo.png" 
          alt="Crystal Ices Logo" 
          style={logoStyle} 
        />
        
        {/* The Stylish Text */}
        <h1 style={textStyle}>
          CRYSTAL ICES
        </h1>
      </div>
    );
  }

  return (
    <main>
      <Outlet />
    </main>
  );
}

// --- Styles and Animations ---

const spinnerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#ffffff',
};

const logoStyle = {
  width: '180px',            // Size of your logo
  height: 'auto',
  marginBottom: '20px',
  filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))', // Makes it pop
  animation: 'bounce 1.5s infinite ease-in-out'        // Link to the keyframe below
};

const textStyle = {
  fontSize: '3.5rem',
  fontWeight: '900',          // Extra Bold
  letterSpacing: '10px',      // Wide spacing for that engineering look
  color: '#003366',           // Dark Blue
  textTransform: 'uppercase',
  fontFamily: '"Arial Black", sans-serif', 
};

export default App;