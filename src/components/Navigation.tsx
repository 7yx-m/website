"use client";

import { Terminal, Box, FileText, Camera, User } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { id: "hero", icon: <Terminal className="w-4 h-4" />, label: "home" },
  { id: "projects", icon: <Box className="w-4 h-4" />, label: "projects" },
  { id: "blog", icon: <FileText className="w-4 h-4" />, label: "blog" },
  { id: "photography", icon: <Camera className="w-4 h-4" />, label: "darkroom" },
  { id: "about", icon: <User className="w-4 h-4" />, label: "about" },
];

export const Navigation = () => {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 200;

      sections.forEach(section => {
        if (section && scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
          setActive(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-obsidian/80 backdrop-blur-md border border-slate-gray/30 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <ul className="flex items-center gap-8">
        {navItems.map((item) => (
          <li key={item.id} className="relative group">
            <a
              href={`#${item.id}`}
              className={`flex flex-col items-center gap-2 transition-colors ${active === item.id ? 'text-pure-white' : 'text-slate-gray hover:text-pure-white/80'}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className={`p-2 rounded-lg transition-all ${active === item.id ? 'bg-white/10' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              
              {/* Tooltip-like Label */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dim-gray px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest border border-slate-gray/40 pointer-events-none">
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
