import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { PulseLoader } from "react-spinners";

function App() {
  const [loading, setLoading] = useState(true);

  // Use a professional Dark Blue/Navy hex code
  const brandDarkBlue = "#003366"; 

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        {/* Increased 'size' for PulseLoader (default is 15) */}
        <PulseLoader color={brandDarkBlue} size={25} margin={10} />
        
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

// Styling Objects
const spinnerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#ffffff' // Clean white background for a professional look
};

const textStyle = {
  marginTop: '30px',
  fontSize: '3.5rem',            // Much bigger text
  fontWeight: '800',             // Extra Bold for that industrial feel
  letterSpacing: '8px',          // Spaced out letters for "Style"
  fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
  color: '#003366',              // Matching Dark Blue
  textTransform: 'uppercase',    // All caps looks more like a corporate logo
};

export default App;