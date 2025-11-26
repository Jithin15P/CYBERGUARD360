// client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
 
import { SocketProvider } from './context/SocketContext'; 

// FIX: Import the new Home page
import Home from './Pages/Home'; 
// FIX: Rename the Simulator component for internal clarity (optional but good practice)
import Simulator from './components/AttackSimulator'; 

import LiveTrafficMonitor from './components/LiveTrafficMonitor';
import AttackLogs from './components/AttackLogs';
import Toast from './components/Toast'; 
import { Search } from 'lucide-react'; 

function App() {
  const [toastData, setToastData] = useState(null);

  const showToast = (title, description, status) => {
    setToastData({ title, description, status });
    setTimeout(() => setToastData(null), 5000); 
  };

  return (
     
    <SocketProvider> 
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-950 text-gray-50">
          {/* Navbar */}
          <nav className="bg-gray-900 p-4 border-b border-gray-800">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-cyan-400">
                CyberGuard 360
              </h1>
              <div className="flex space-x-6">
                
                {/* FIX: Set Home as the root navigation */}
                <RouterLink to="/" className="text-lg font-semibold hover:text-cyan-400 transition-colors">
                  Home
                </RouterLink>

                {/* FIX: Set Simulator to a new path to resolve the conflict with root path */}
                <RouterLink to="/launch" className="text-lg font-semibold hover:text-cyan-400 transition-colors">
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
              
              {/* FIX: Root path (/) now maps to the Home landing page */}
              <Route path="/" element={<Home />} /> 
              
              {/* FIX: Simulator is now on /launch */}
              <Route path="/launch" element={<Simulator showToast={showToast} />} /> 

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
    </SocketProvider>
  );
}

export default App;