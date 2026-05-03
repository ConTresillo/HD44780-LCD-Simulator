// src/App.tsx
import React from "react";
import { ThemeProvider } from "./components/themes/ThemeProvider";
import AppLayout from "./components/layout/AppLayout";
import ComponentTest from "./components/ComponentTester/ComponentTest.tsx"; // or your router outlet

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppLayout>
        <ComponentTest />
      </AppLayout>
    </ThemeProvider>
  );
};

export default App;
