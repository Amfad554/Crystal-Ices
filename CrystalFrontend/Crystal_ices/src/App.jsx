import { Outlet } from "react-router-dom";
import Navbar from "./Shared/Navbar"; // Adjust path if needed

function App() {
  return (
    <>
      <main>
        <Outlet /> 
      </main>
    </>
  );
}

export default App;