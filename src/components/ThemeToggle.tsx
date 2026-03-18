import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/src/store/useAppStore";
import { motion } from "motion/react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[var(--color-border-subtle)] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 shadow-sm overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-4 h-4" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-4 h-4" />
      </motion.div>
      
      {/* Invisible placeholder to maintain size */}
      <Sun className="w-4 h-4 opacity-0" />
    </button>
  );
}
