"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const BOOT_LOGS = [
  "Initializing NS-OS v1.0.0...",
  "Loading Kernel Modules...",
  "Checking Hardware integrity... OK",
  "Mounting /dev/projects... MOUNTED",
  "Parsing /content/blog/cpp-optimization.md... DONE",
  "Parsing /content/blog/witnessing-history.md... DONE",
  "Indexing Markdown logs... OK",
  "Establishing Secure Connection... DONE",
  "Starting Terminal UI...",
  "WELCOME, USER.",
];

export const BootScreen = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Aesthetic decision: Always show boot sequence for the atmosphere
    // sessionStorage check removed to bring back the "loading screen aesthetic" on every load

    let currentLog = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentLog < BOOT_LOGS.length) {
          setLogs(prev => [...prev, BOOT_LOGS[currentLog]]);
          currentLog++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
          }, 800);
        }
      }, 180);
      return () => clearInterval(interval);
    }, 200);

    return () => clearTimeout(startTimeout);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.05,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
          className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-start justify-center p-12 font-mono text-sm uppercase tracking-widest text-pure-white"
        >
          {/* Scanline effect specifically for boot screen */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
          
          <div className="max-w-2xl space-y-2 relative z-10">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4"
              >
                <span className="text-slate-gray/60">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-pure-white/90 shadow-[0_0_8px_rgba(255,255,255,0.3)]">{log}</span>
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-pure-white inline-block ml-2 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
