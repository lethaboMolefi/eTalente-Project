import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import FundManagementPage from './pages/FundManagementPage';
import WithdrawalPage from './pages/WithdrawalPage';

function NavLinks() {
  const location = useLocation();
  const baseClass = "text-sm font-medium transition-colors px-3 py-2 rounded-md";
  const activeClass = "bg-blue-50 text-blue-700";
  const inactiveClass = "text-gray-500 hover:text-gray-900 hover:bg-gray-50";

  return (
    <nav className="flex space-x-4">
      <Link 
        to="/" 
        className={`${baseClass} ${location.pathname === '/' ? activeClass : inactiveClass}`}
      >
        Dashboard
      </Link>
      <Link 
        to="/funds" 
        className={`${baseClass} ${location.pathname.startsWith('/funds') || location.pathname.startsWith('/withdraw') ? activeClass : inactiveClass}`}
      >
        Fund Management
      </Link>
    </nav>
  );
}

// Main application component setting up routing
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-xl font-bold tracking-tight text-gray-900">
                Enviro365<span className="text-blue-600 font-light">Investments</span>
              </div>
              <NavLinks />
            </div>
          </div>
        </header>
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Routing configuration for the 3 distinct views */}
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/funds" element={<FundManagementPage />} />
            <Route path="/withdraw" element={<WithdrawalPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
