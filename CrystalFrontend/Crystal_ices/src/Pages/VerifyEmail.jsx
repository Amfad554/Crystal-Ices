import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// --- CENTRALIZED API CONFIG ---
const BASE_URL = "https://crystalbackend.onrender.com";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      console.log("🔗 Token extracted from URL:", token);

      if (!token) {
        console.error("❌ No token found in URL");
        setStatus("error");
        return;
      }

      try {
        // Use the centralized BASE_URL for the production environment
        const response = await fetch(`${BASE_URL}/api/users/verifyemail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        });

        const data = await response.json();
        console.log("📡 Backend Response:", data);

        if (response.ok && data.success) {
          setStatus("success");
          // Redirect to login (Auth page) after 3 seconds
          setTimeout(() => navigate("/auth"), 3000);
        } else {
          console.error("❌ Backend rejected token:", data.message);
          setStatus("error");
        }
      } catch (error) {
        console.error("🔥 Network/Fetch Error:", error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border border-slate-100">
        {/* STATE: VERIFYING */}
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="animate-spin w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-800">Verifying...</h2>
            <p className="text-slate-500">
              Connecting to Crystal Ices Secure Server
            </p>
          </div>
        )}

        {/* STATE: SUCCESS */}
        {status === "success" && (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">
              ✓
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Verified!</h2>
            <p className="text-slate-600 text-lg">
              Your account is now active.
            </p>
            <p className="text-slate-400 text-sm">
              Redirecting to login shortly...
            </p>
          </div>
        )}

        {/* STATE: ERROR */}
        {status === "error" && (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">
              ✕
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Invalid Link</h2>
            <p className="text-slate-600">
              The token is expired, already used, or the server is down.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="mt-6 w-full bg-[#0B2A4A] hover:bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
