 // client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import AttackSimulator from './components/AttackSimulator';
import LiveTrafficMonitor from './components/LiveTrafficMonitor';
import AttackLogs from './components/AttackLogs';
import Toast from './components/Toast'; // Our custom Toast

function App() {
  const [toastData, setToastData] = useState(null);

  const showToast = (title, description, status) => {
    setToastData({ title, description, status });
    setTimeout(() => setToastData(null), 5000); // Auto-dismiss after 5s
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-950 text-gray-50">
        {/* Navbar */}
        <nav className="bg-gray-900 p-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-cyan-400">
              CyberGuard 360
            </h1>
            <div className="flex space-x-6">
              <RouterLink to="/" className="text-lg font-semibold hover:text-cyan-400 transition-colors">
                Simulator
              </RouterLink>
              <RouterLink to="/monitor" className="text-lg font-semibold hover:text-cyan-400 transition-colors">
                Live Monitor
              </RouterLink>
              <RouterLink to="/logs" className="text-lg font-semibold hover:text-cyan-400 transition-colors">
                Attack Logs
              </RouterLink>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<AttackSimulator showToast={showToast} />} />
            <Route path="/monitor" element={<LiveTrafficMonitor />} />
            <Route path="/logs" element={<AttackLogs showToast={showToast} />} />
          </Routes>
        </main>

        {/* Toast Container */}
        {toastData && (
          <Toast
            title={toastData.title}
            description={toastData.description}
            status={toastData.status}
            onClose={() => setToastData(null)}
          />
        )}

        {/* Footer */}
        <footer className="bg-gray-900 p-4 border-t border-gray-800 text-center text-gray-500 text-sm mt-auto">
          &copy; {new Date().getFullYear()} CyberGuard 360. Built for learning and demonstration.
        </footer>
      </div>
    </Router>
  );
}

export default App;