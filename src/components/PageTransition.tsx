"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { TypingText } from "./TypingText";

interface PageTransitionProps {
  isActive: boolean;
  command: string;
  onComplete: () => void;
}

export const PageTransition = ({ isActive, command, onComplete }: PageTransitionProps) => {
  const [stage, setStage] = useState<"command" | "loading" | "complete">("command");

  useEffect(() => {
    if (!isActive) return;

    setStage("command");

    const commandTimer = setTimeout(() => {
      setStage("loading");
    }, 800);

    const loadingTimer = setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(commandTimer);
      clearTimeout(loadingTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-obsidian flex items-center justify-center font-mono text-pure-white"
      >
        <div className="text-center space-y-4">
          {stage === "command" && (
            <div className="text-lg">
              <span className="text-slate-gray">$ </span>
              <TypingText
                text={command}
                speed={60}
                onComplete={() => setStage("loading")}
              />
            </div>
          )}

          {stage === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="text-lg">
                <span className="text-slate-gray">$ </span>
                <span>{command}</span>
              </div>
              <div className="text-slate-gray">
                <TypingText
                  text="Loading..."
                  speed={100}
                  cursor=""
                  onComplete={() => setStage("complete")}
                />
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="ml-1"
                >
                  █
                </motion.span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};