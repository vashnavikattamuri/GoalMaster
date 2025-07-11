import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Auth from './pages/Auth';
import PasswordReset from './pages/PasswordReset';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import Planner from './pages/Planner';
import Rewards from './pages/Rewards';
import Contact from './pages/Contact';
import FloatingElements from './components/FloatingElements';

function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ['/auth', '/password-reset'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingElements />
      {!shouldHideHeader && <Header />}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
