import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import FundManagementPage from './pages/FundManagementPage';
import WithdrawalPage from './pages/WithdrawalPage';

// Main application component setting up routing
function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Portfolio Page (Dashboard)</Link></li>
            <li><Link to="/funds">Fund Management Page</Link></li>
          </ul>
        </nav>
        <hr />
        
        {/* Routing configuration for the 3 distinct views */}
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/funds" element={<FundManagementPage />} />
          <Route path="/withdraw" element={<WithdrawalPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
