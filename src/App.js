import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Auth from './Auth';
import PasswordReset from './PasswordReset';
import Habits from './Habits';
import Goals from './Goals';
import Planner from './Planner';
import Rewards from './Rewards';
import Contact from './Contact';
import FloatingElements from './FloatingElements';

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
