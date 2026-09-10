import { useState, useEffect } from 'react';
import { getInvestorDetails, getProducts } from '../services/apiService';

// Portfolio Page component serving as the Dashboard
export default function PortfolioPage() {
  // Core state management for the Portfolio view
  // 'investor' and 'products' store the payload from our Spring Boot backend
  const [investor, setInvestor] = useState(null);
  const [products, setProducts] = useState([]);
  
  // UI state for toggling the privacy of the total balance
  const [showBalance, setShowBalance] = useState(true);
  const [dateFilter, setDateFilter] = useState('today');
  
  // Error state for handling network/fetch failures
  const [error, setError] = useState(null);

  // useEffect triggers the data fetch exactly once when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const investorData = await getInvestorDetails();
        const productsData = await getProducts();
        setInvestor(investorData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message || 'Failed to connect to backend.');
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 font-medium">
        Error: {error} (Make sure the Spring Boot backend is running on port 8080)
      </div>
    );
  }

  if (!investor || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading portfolio...
      </div>
    );
  }

  // Calculate performance logic
  const calculatePerformance = (initial, current) => {
    if (initial === 0) return { diff: 0, text: '[+0%]', type: 'neutral' };
    const diff = current - initial;
    const percent = (Math.abs(diff) / initial) * 100;
    const roundedPercent = percent.toFixed(2);
    
    if (diff > 0) {
      return { diff, text: `[+${roundedPercent}%]`, type: 'positive' };
    } else if (diff < 0) {
      return { diff, text: `[-${roundedPercent}%]`, type: 'negative' };
    }
    return { diff: 0, text: '[0%]', type: 'neutral' };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portfolio Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {investor.name}</p>
      </div>
      
      {/* Total Balance Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Combined Balance</h2>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-light text-gray-900">
              {showBalance ? `R${investor.totalBalance.toLocaleString()}` : '****'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="mt-4 sm:mt-0 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
        >
          {showBalance ? 'Hide Balance' : 'Show Balance'}
        </button>
      </div>

      {/* Products Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-gray-300 transition-colors">
              <div className="text-sm text-gray-500 font-medium mb-1">{product.type.replace('_', ' ')}</div>
              <h4 className="text-xl font-medium text-gray-900 mb-4">{product.name}</h4>
              <div className="text-2xl font-light text-gray-900">
                R{product.balance.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Performance Report</h3>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
              BETA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="dateFilter" className="text-sm text-gray-500 font-medium">Filter:</label>
            <select 
              id="dateFilter"
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full sm:w-48 rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
            >
              <option value="today">Today</option>
              <option value="range">Specific Date Range</option>
            </select>
          </div>
        </div>

        <div className="p-5">
          <ul className="divide-y divide-gray-100">
            {products.map(product => {
              const perf = calculatePerformance(product.initialInvestment, product.balance);
              return (
                <li key={`perf-${product.id}`} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Initial: R{product.initialInvestment.toLocaleString()} <span className="mx-2 text-gray-300">|</span> 
                      Current: R{product.balance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium border ${
                      perf.type === 'positive' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : perf.type === 'negative'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {perf.text}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
