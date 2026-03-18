import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/src/store/useAppStore";
import { motion } from "motion/react";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#ffffff] relative overflow-hidden font-sans">
      


      {/* Top Left Orange Wedge */}
      <div 
        className="absolute top-0 left-0 w-full max-w-md h-[45vh] bg-gradient-to-br from-[#ffa64d] to-[#ff5e00] opacity-90 pointer-events-none"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />

      {/* Bottom Right Blue Wedge */}
      <div 
        className="absolute bottom-0 right-0 w-full max-w-lg h-[40vh] bg-gradient-to-tl from-[#0052d4] via-[#4364f7] to-[#6fb1fc] opacity-80 pointer-events-none"
        style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm z-10 flex flex-col items-center px-8 pb-12"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 pt-10">
          {/* Logo Text */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline">
              <span className="text-[28px] font-black text-[#009b4d] tracking-tight">Lucas</span>
              <span className="text-[28px] font-black text-[#006837] tracking-tighter ml-1">TVS</span>
              <span className="text-[10px] font-black text-[#009b4d] align-top relative -top-3 left-0.5">&reg;</span>
            </div>
            <div className="w-full flex justify-end pr-5 -mt-1.5">
              <span className="text-[11px] font-black italic text-[#009b4d] tracking-[0.1em]">DRIVEN</span>
              <span className="text-[6px] font-bold text-[#009b4d] relative -top-1 ml-[1px]">&reg;</span>
            </div>
          </div>

          {/* Briefcase Icon */}
          <div className="mt-7 mb-4 relative">
            <div className="absolute inset-0 bg-[#009b4d] blur-[15px] opacity-30 rounded-full scale-75" />
            <div className="w-16 h-14 border-[2.5px] border-[#009b4d] rounded-xl flex flex-col items-center bg-[#ffffff] relative z-10 shadow-[0_10px_20px_rgba(0,155,77,0.15)]">
              {/* Briefcase Top Handle */}
              <div className="w-6 h-2 border-t-[2.5px] border-x-[2.5px] border-[#009b4d] rounded-t-lg absolute -top-2.5 bg-[#ffffff]" />
              {/* Briefcase Middle line & Lock */}
              <div className="w-full h-[2.5px] bg-[#009b4d] mt-5 relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-4 h-3 rounded-[3px] border-[2px] border-[#009b4d] bg-[#ffffff] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#009b4d]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          {/* Username Input */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#94a3b8]">
              <User className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              placeholder="Login"
              className="w-full h-[52px] pl-[3.25rem] pr-4 rounded-[14px] bg-[#ffffff] text-[#334155] font-semibold text-[15px] focus:outline-none transition-all duration-200 border border-[#e2e8f0] shadow-[0_8px_20px_rgb(0,180,255,0.08)] focus:border-[#bae6fd] focus:shadow-[0_8px_25px_rgb(0,180,255,0.15)]"
              style={{ paddingBottom: '2px' }}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#94a3b8]">
              <Lock className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full h-[52px] pl-[3.25rem] pr-4 rounded-[14px] bg-[#ffffff] text-[#334155] font-semibold text-[15px] focus:outline-none transition-all duration-200 border border-[#e2e8f0] shadow-[0_8px_20px_rgb(0,180,255,0.08)] focus:border-[#bae6fd] focus:shadow-[0_8px_25px_rgb(0,180,255,0.15)]"
              style={{ paddingBottom: '2px' }}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end w-full pt-1">
            <a href="#" className="text-[11px] font-bold text-[#3b82f6] hover:text-[#1d4ed8] transition-colors">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <div className="pt-5 pb-8 flex justify-center">
            <button
              type="submit"
              className="h-[46px] px-10 rounded-xl bg-gradient-to-r from-[#ff8c3a] to-[#ff5e00] text-white font-bold text-[13px] tracking-wide shadow-[0_8px_20px_rgba(255,100,0,0.35)] hover:shadow-[0_10px_25px_rgba(255,100,0,0.45)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            >
              SIGN IN
            </button>
          </div>
        </form>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center w-full z-10">
        <p className="text-[9px] text-[#94a3b8] font-medium">&copy; 2026 Lucas TVS. All rights reserved.</p>
      </div>
    </div>
  );
}
