"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", href: "/#about" },
  { name: "Work", href: "/#projects" },
  { name: "Experience", href: "/#experience" },
  { name: "Skills", href: "/#skills" },
  { name: "Solutions", href: "/solutions" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleNavigation = (href: string) => {
    if (href.startsWith("/#") && window.location.pathname === "/") {
      const element = document.querySelector(href.slice(1)) as HTMLElement;
      if (element) {
        const offsetTop = element.offsetTop - 88;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    } else {
      window.location.href = href;
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="h-[3px] w-full bg-gradient-to-r from-primary via-moss to-primary" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Wordmark */}
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-baseline gap-0.5 group"
          >
            <span className="font-serif italic text-2xl sm:text-3xl text-primary">alkindy</span>
            <span className="font-sans font-bold text-2xl sm:text-3xl text-foreground tracking-tight">Tech</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="text-sm font-medium uppercase tracking-wider text-foreground/70 hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-foreground/5"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Theme Toggle & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && (
                <>
                  <Sun className="h-4 w-4 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </>
              )}
            </button>

            <button
              onClick={() => handleNavigation("/#contact")}
              className="hidden sm:inline-flex items-center gap-1.5 bg-foreground text-background rounded-full pl-5 pr-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Let's Talk
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="block w-full text-left text-lg font-serif text-foreground/85 hover:text-foreground transition-colors py-2.5"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => handleNavigation("/#contact")}
                  className="inline-flex items-center gap-1.5 bg-foreground text-background rounded-full pl-5 pr-4 py-2.5 text-sm font-semibold"
                >
                  Let's Talk
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
