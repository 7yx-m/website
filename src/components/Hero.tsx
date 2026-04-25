"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const achievements = [
  "Competitive Programmer",
  "National AI Olympiad Honorable Mention",
  "Student Developer",
  "Gandaki Boarding School Student",
];

export const Hero = () => {
  const [currentText, setCurrentText] = useState("");
  const [achievementIndex, setAchievementIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = achievements[achievementIndex];
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(50);
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setAchievementIndex((prev) => (prev + 1) % achievements.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, achievementIndex, typingSpeed]);

  return (
    <section className="min-h-screen flex flex-col justify-center bg-obsidian border-b border-slate-gray/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="content-container"
      >
        <div className="flex flex-col-reverse md:flex-row gap-sys-md items-start md:items-center justify-between mb-sys-md">
          <div className="flex-1">
            <div className="flex items-center gap-sys-xs mb-sys-xs">
              <div className="w-2 h-2 rounded-full bg-pure-white animate-pulse" />
              <span className="text-sm font-mono tracking-widest text-slate-gray uppercase">
                System Initialization... [SUCCESS]
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold mb-sys-sm tracking-tighter">
              NEEKSON<br />
              <span className="text-slate-gray">SHRESTHA</span>
            </h1>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-pure-white/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-slate-gray/30 overflow-hidden bg-dim-gray">
              <img 
                src="/images/profile.jpg" 
                alt="Neekson Shrestha" 
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=NS';
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-12 flex items-center mb-sys-md">
          <span className="text-xl md:text-2xl font-mono text-pure-white/80">
            {"> "}
            {currentText}
            <span className="inline-block w-2 h-6 bg-pure-white ml-1 animate-blink" />
          </span>
        </div>

        <div className="mt-sys-lg grid grid-cols-1 md:grid-cols-2 gap-sys-md border-t border-slate-gray/30 pt-sys-md">
          <div>
            <p className="text-sm text-slate-gray mb-sys-xs uppercase tracking-widest font-mono">Current Status</p>
            <p className="text-pure-white/60">Building high-performance tools and exploring neural networks.</p>
          </div>
          <div className="flex flex-col md:items-end">
            <p className="text-sm text-slate-gray mb-sys-xs uppercase tracking-widest font-mono">Location</p>
            <p className="text-pure-white/60">Pokhara, Nepal // [28.2096° N, 83.9856° E]</p>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
};
