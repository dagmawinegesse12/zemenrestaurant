import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ["menu", "order-online", "about", "reserve"];
      const scrollY = window.scrollY + 100;

      let closestSection = "";
      let minDistance = Infinity;

      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const distance = Math.abs(el.offsetTop - scrollY);
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = id;
          }
        }
      }

      if (closestSection !== activeSection) {
        setActiveSection(closestSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // Dark mode detection
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  // Scroll to section after mobile menu closes
  useEffect(() => {
    if (!isOpen && pendingScroll) {
      const el = document.getElementById(pendingScroll);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setPendingScroll(null);
    }
  }, [isOpen, pendingScroll]);

  const scrollToSection = (id: string) => {
    if (isOpen) {
      setPendingScroll(id);
      setIsOpen(false);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const linkClass = (id: string) =>
    `cursor-pointer hover:text-yellow-500 transition ${
      activeSection === id ? "text-yellow-500 font-semibold" : ""
    }`;

  const navBg = darkMode ? "bg-[#2C1A10]" : "bg-white text-black";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${navBg} ${
        isScrolled ? "bg-opacity-90 py-2" : "bg-opacity-60 py-4"
      } backdrop-blur-md px-6 shadow-lg transition-all`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <a href="/" className="hidden md:flex items-center space-x-2">
            <img
              src="/favicon.png"
              alt="Zemen Logo"
              className="h-10 w-10 rounded-full bg-white/10 p-1"
            />
            <span className="font-bold text-xl">Zemen Bar & Restaurant</span>
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <button onClick={() => scrollToSection("menu")} className={linkClass("menu")}>Menu</button>
          <button onClick={() => scrollToSection("order-online")} className={linkClass("order-online")}>Order Online</button>
          <button onClick={() => scrollToSection("about")} className={linkClass("about")}>About</button>
          <button onClick={() => scrollToSection("reserve")} className={linkClass("reserve")}>Reserve</button>
          <button className="ml-4 text-sm bg-white/20 px-3 py-1 rounded hover:bg-yellow-500 hover:text-black transition">
            EN | አማ
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      <AnimatePresence
  onExitComplete={() => {
    if (pendingScroll) {
      const el = document.getElementById(pendingScroll);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setPendingScroll(null);
    }
  }}
>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden overflow-hidden mt-3 space-y-4"
    >
      {/* Logo + Restaurant Name */}
      <a href="/" className="flex items-center space-x-3 px-4">
        <img
          src="/favicon.png"
          alt="Zemen Logo"
          className="h-10 w-10 rounded-full bg-white/10 p-1"
        />
        <span className="font-bold text-lg">Zemen Bar & Restaurant</span>
      </a>

      {/* Menu Links */}
      <button onClick={() => scrollToSection("menu")} className="block px-4 py-2 hover:text-yellow-500">Menu</button>
      <button onClick={() => scrollToSection("order-online")} className="block px-4 py-2 hover:text-yellow-500">Order Online</button>
      <button onClick={() => scrollToSection("about")} className="block px-4 py-2 hover:text-yellow-500">About</button>
      <button onClick={() => scrollToSection("reserve")} className="block px-4 py-2 hover:text-yellow-500">Reserve</button>
    </motion.div>
  )}
</AnimatePresence>


    </nav>
  );
};

export default Navbar;
