"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const BOOT_LOGS = [
  "Initializing NS-OS v1.0.0...",
  "Loading Kernel Modules...",
  "Checking Hardware integrity... OK",
  "Mounting /dev/projects... MOUNTED",
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
    
    // Always show boot sequence for the atmosphere (as requested)
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
        }, 500);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || isFinished) return null;

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-start justify-center p-12 font-mono text-sm uppercase tracking-widest text-pure-white"
    >
      <div className="max-w-2xl space-y-2">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <span className="text-slate-gray">[{new Date().toLocaleTimeString()}]</span>
            <span>{log}</span>
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-pure-white inline-block ml-2"
        />
      </div>
    </motion.div>
  );
};
