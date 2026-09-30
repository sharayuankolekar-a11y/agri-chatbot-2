import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Crops from './pages/Crops';
import Consultations from './pages/Consultations';
import Learn from './pages/Learn';
import AssistantWorkspace from './pages/AssistantWorkspace';

function AppLayout() {
  const location = useLocation();
  const isWorkspaceRoute = location.pathname === '/' || location.pathname === '/assistant' || location.pathname === '/home';

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F3E8] dark:bg-[#07130e] text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased overflow-x-hidden selection:bg-[#1F7A4D]/20 selection:text-[#14532D]">
      {!isWorkspaceRoute && <Navbar />}
      <main className={isWorkspaceRoute ? "h-screen h-[100dvh] overflow-hidden" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<AssistantWorkspace />} />
          <Route path="/assistant" element={<AssistantWorkspace />} />
          <Route path="/home" element={<AssistantWorkspace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/categories" element={<Crops />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/history" element={<Consultations />} />
          <Route path="/learn" element={<Learn />} />
        </Routes>
      </main>
      {!isWorkspaceRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}
