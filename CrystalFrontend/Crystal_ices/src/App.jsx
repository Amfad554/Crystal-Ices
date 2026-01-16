import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { PulseLoader} from "react-spinners"; // Professional, industrial look

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading (e.g., checking authentication or fetching site settings)
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        {/* Engineering/Oil vibe: Use Steel Blue, Slate, or Safety Orange */}
        <PulseLoader color="blue" width={200} height={15} />
        <h1 style={{ marginTop: '20px', fontFamily: 'sans-serif', color: 'blue' }}>
          Crystal Ices
        </h1>
      </div>
    );
  }

  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

// Simple centering styles
const spinnerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f8f9fa'
};

export default App;