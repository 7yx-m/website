"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

interface CompilerOverlayProps {
  projectTitle: string;
  onComplete: () => void;
}

export const ProjectCompiler = ({ projectTitle, onComplete }: CompilerOverlayProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const steps = [
    `Fetching dependencies for ${projectTitle}...`,
    "Compiling source files...",
    "Linking binary modules...",
    "Optimizing production bundle...",
    "Running unit tests... PASSED",
    "Finalizing binary output...",
    "EXECUTION SUCCESSFUL."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, steps[currentStep]]);
        setProgress(((currentStep + 1) / steps.length) * 100);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-obsidian/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 font-mono"
    >
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-gray/30 pb-4">
          <Terminal className="w-5 h-5 text-pure-white" />
          <h3 className="text-sm uppercase tracking-[0.4em]">Compiling Module: {projectTitle}</h3>
        </div>

        <div className="space-y-2 mb-8 h-48 overflow-hidden text-xs text-slate-gray uppercase">
          {logs.map((log, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-pure-white/20 mr-4">[{Math.floor(Math.random() * 900) + 100}ms]</span>
              {log}
            </motion.div>
          ))}
        </div>

        <div className="w-full h-1 bg-dim-gray relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-pure-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center text-[10px] text-slate-gray uppercase tracking-widest font-bold">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
};
