import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Lightbulb, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Lightbulb, label: "Insights", path: "/insights" },
  { icon: MessageSquare, label: "Ask AI", path: "/ask-ai" },
  { icon: FileText, label: "Reports", path: "/reports" },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--color-surface)] text-slate-900 overflow-hidden relative font-sans">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 glass glass-border pb-safe z-20 relative shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200",
                  isActive ? "text-brand-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-brand-600 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
