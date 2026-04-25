"use client";

import { createContext, useContext, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { useRouter } from "next/navigation";

interface NavigationContextType {
  navigate: (command: string, path?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentCommand, setCurrentCommand] = useState("");
  const router = useRouter();

  const navigate = (command: string, path?: string) => {
    setCurrentCommand(command);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    // Scroll to the section
    const section = currentCommand.split(" ")[1];
    if (section) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
      <PageTransition
        isActive={isTransitioning}
        command={currentCommand}
        onComplete={handleTransitionComplete}
      />
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};