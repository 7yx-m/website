"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: string;
  onComplete?: () => void;
  className?: string;
}

export const TypingText = ({
  text,
  speed = 50,
  delay = 0,
  cursor = "█",
  onComplete,
  className = ""
}: TypingTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => startTyping(), delay);
      return () => clearTimeout(delayTimer);
    } else {
      startTyping();
    }
  }, [text, delay]);

  const startTyping = () => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setShowCursor(false);
        onComplete?.();
      }
    }, speed + Math.random() * 20); // Slight randomness

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (showCursor) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [showCursor]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && <span className="animate-pulse">{cursor}</span>}
    </span>
  );
};