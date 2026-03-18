import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/src/store/useAppStore";
import { motion } from "motion/react";
import { Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-white relative overflow-hidden px-6 font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-100/50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-100/40 blur-[100px] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm z-10 flex flex-col items-center"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
            <span className="text-2xl font-black text-white tracking-tight">LT</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">Lucas</span>
            <div className="flex flex-col ml-2">
              <span className="text-3xl font-bold text-slate-900 tracking-tight leading-none">TVS</span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] leading-none mt-1 uppercase">Driven</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3 font-medium">ActionBoard for Managing Director</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <User className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="w-full h-13 pl-12 pr-4 rounded-xl bg-white border border-[var(--color-border-default)] text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500/40 transition-all duration-200 shadow-sm"
              required
            />
          </div>

          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full h-13 pl-12 pr-4 rounded-xl bg-white border border-[var(--color-border-default)] text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500/40 transition-all duration-200 shadow-sm"
              required
            />
          </div>

          <div className="flex justify-end w-full">
            <a href="#" className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Forgot Password?
            </a>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-13 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/20 hover:shadow-xl hover:shadow-brand-500/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center w-full z-10">
        <p className="text-[11px] text-slate-400 font-medium">&copy; 2026 Lucas TVS. All rights reserved.</p>
      </div>
    </div>
  );
}
