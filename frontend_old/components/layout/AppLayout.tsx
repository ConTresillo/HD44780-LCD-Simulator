// src/components/layout/AppLayout.tsx
import React, { useState } from "react";
import Navbar from "./Navbar";
import SettingsModal from "../settings/SettingsModal";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenSettings={() => setSettingsOpen(true)} />
      <main className="flex-1">
        {children}
      </main>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
