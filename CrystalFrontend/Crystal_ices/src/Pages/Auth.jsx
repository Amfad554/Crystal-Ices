import React, { useState } from "react";
import Layout from "../Shared/Layout/Layout";


// const Layout = ({ children }) => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <nav className="bg-[#0B2A4A] text-white p-4 flex justify-between items-center px-6">
//         <div className="flex items-center gap-2">
//           <div className="bg-blue-500 w-8 h-8 rounded flex items-center justify-center font-bold">CI</div>
//           <span className="font-bold tracking-tight uppercase">Crystal Ices</span>
//         </div>
//         <div className="hidden md:flex gap-6 text-sm font-medium">
//           <button className="hover:text-blue-400">Services</button>
//           <button className="hover:text-blue-400">Catalogue</button>
//           <button className="hover:text-blue-400 font-bold border-b-2 border-blue-500">Portal</button>
//         </div>
//       </nav>
//       <div className="flex-grow">
//         {children}
//       </div>
//       <footer className="bg-slate-900 text-slate-500 p-8 text-center text-sm">
//         &copy; {new Date().getFullYear()} Crystal Ices Energies Nigeria Limited. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// SVG Eye Icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);

const Auth = () => {
  // view: 'login' | 'signup' | 'forgot'
  const [view, setView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Layout>
      <main className="min-h-screen font-sans text-slate-900 bg-slate-50 flex items-center justify-center py-20 px-6">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          
          {/* --- LEFT SIDE: Visual Branding --- */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0B2A4A] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-xl mb-8">CI</div>
              <h1 className="text-4xl font-bold leading-tight mb-6">
                {view === 'login' && "Welcome Back to the Portal"}
                {view === 'signup' && "Join Our Industrial Network"}
                {view === 'forgot' && "Account Recovery"}
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
                {view === 'login' && "Access your procurement dashboards and track equipment rentals from one secure location."}
                {view === 'signup' && "Register your business to access wholesale pricing, industrial catalogs, and logistics tracking."}
                {view === 'forgot' && "Enter your registered email address and we'll send instructions to reset your secure access."}
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-slate-700">
               <p className="text-sm text-slate-400 font-medium mb-4">Official Energy Partner</p>
               <div className="flex gap-6 opacity-40 grayscale brightness-200">
                 <span className="text-xs font-black tracking-widest uppercase">Shell</span>
                 <span className="text-xs font-black tracking-widest uppercase">TotalEnergies</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: The Form --- */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {view === 'login' && "Client Login"}
                {view === 'signup' && "Create Account"}
                {view === 'forgot' && "Reset Password"}
              </h2>
              <p className="text-slate-500 text-sm">
                {view === 'login' && "Enter your credentials to manage your projects."}
                {view === 'signup' && "Fill in your business details to get started."}
                {view === 'forgot' && "Don't worry, it happens. Let's get you back in."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Registration Specific Fields */}
              {view === 'signup' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Business Name</label>
                      <input type="text" placeholder="e.g. Lagos Logisitics" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Phone Number</label>
                      <input type="tel" placeholder="+234..." className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Industry Sector</label>
                    <select className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 text-sm appearance-none">
                      <option>Oil & Gas</option>
                      <option>Construction</option>
                      <option>Manufacturing</option>
                      <option>Real Estate</option>
                      <option>Other</option>
                    </select>
                  </div>
                </>
              )}

              {/* Shared Email Field */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Email Address</label>
                <input type="email" placeholder="name@company.com" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-all" />
              </div>

              {/* Password Fields */}
              {view !== 'forgot' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  {view === 'signup' && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Confirm Password</label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {view === 'login' && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setView('forgot')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button className="w-full bg-[#0B2A4A] hover:bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-lg active:scale-[0.98] mt-2">
                {view === 'login' && "Sign In"}
                {view === 'signup' && "Complete Registration"}
                {view === 'forgot' && "Send Reset Link"}
              </button>

              {view === 'forgot' && (
                <button 
                  onClick={() => setView('login')}
                  className="w-full text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-800 transition-colors"
                >
                  Back to Login
                </button>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-xs">
                {view === 'login' && "Don't have an industrial account?"}
                {view === 'signup' && "Already have a registered account?"}
                {(view === 'login' || view === 'signup') && (
                  <button 
                    onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                    className="ml-2 text-blue-600 font-bold hover:underline"
                  >
                    {view === 'login' ? "Register Now" : "Sign In Here"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Auth;