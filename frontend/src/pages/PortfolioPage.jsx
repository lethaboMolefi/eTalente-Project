import { useState, useEffect } from 'react';
import { getInvestorDetails, getProducts } from '../services/apiService';

// Portfolio Page component serving as the Dashboard
export default function PortfolioPage() {
  // State for holding investor details and product data
  const [investor, setInvestor] = useState(null);
  const [products, setProducts] = useState([]);
  
  // State for toggling balance visibility
  const [showBalance, setShowBalance] = useState(true);
  
  // State for performance report date filter
  const [dateFilter, setDateFilter] = useState('today');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const investorData = await getInvestorDetails();
      const productsData = await getProducts();
      setInvestor(investorData);
      setProducts(productsData);
    };
    fetchData();
  }, []);

  if (!investor || products.length === 0) {
    return <div>Loading portfolio...</div>;
  }

  // Calculate percentage difference helper function
  const calculatePerformance = (initial, current) => {
    if (initial === 0) return '[UP 0%]';
    const diff = current - initial;
    const percent = (Math.abs(diff) / initial) * 100;
    const roundedPercent = percent.toFixed(2);
    
    if (diff >= 0) {
      return `[UP ${roundedPercent}%]`;
    }
    return `[DOWN ${roundedPercent}%]`;
  };

  return (
    <div>
      <h1>Portfolio Page (The Dashboard)</h1>
      
      {/* Display user's total combined balance and visibility toggle */}
      <div>
        <h2>Total Combined Balance</h2>
        <p>
          {showBalance ? `$${investor.totalBalance}` : '****'}
        </p>
        <button onClick={() => setShowBalance(!showBalance)}>
          Show/Hide Balance
        </button>
      </div>

      <hr />

      {/* Display products */}
      <div>
        <h2>Your Products</h2>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - Balance: ${product.balance}
            </li>
          ))}
        </ul>
      </div>

      <hr />

      {/* Performance report section */}
      <div>
        <h2>Performance Report (Under Construction)</h2>
        
        {/* Date filter dropdown */}
        <label>Date Filter: </label>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="today">Today</option>
          <option value="range">Specific Date Range</option>
        </select>

        {/* Product performance details */}
        <ul>
          {products.map(product => (
            <li key={`perf-${product.id}`}>
              {product.name}: 
              Initial Investment: ${product.initialInvestment} | 
              Current Amount: ${product.balance} 
              {' '}
              {calculatePerformance(product.initialInvestment, product.balance)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
