import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Farms from "@/components/pages/Farms";
import Crops from "@/components/pages/Crops";
import Tasks from "@/components/pages/Tasks";
import Weather from "@/components/pages/Weather";
import Finances from "@/components/pages/Finances";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/": return "Dashboard";
      case "/farms": return "Farms";
      case "/crops": return "Crops";
      case "/tasks": return "Tasks";
      case "/weather": return "Weather";
      case "/finances": return "Finances";
      default: return "FarmFlow";
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-sage">
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          
          <div className="flex-1 flex flex-col lg:ml-0">
            <Header 
              title={getPageTitle(window.location.pathname)}
              onMenuClick={() => setSidebarOpen(true)}
            />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/farms" element={<Farms />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/finances" element={<Finances />} />
              </Routes>
            </main>
          </div>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;