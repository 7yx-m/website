"use client";

import { NavigationProvider } from "@/contexts/NavigationContext";
import { BootScreen } from "@/components/BootScreen";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationProvider>
      <BootScreen />
      {children}
    </NavigationProvider>
  );
};