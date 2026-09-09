import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getInvestorDetails, getProducts, getWithdrawalHistory, submitWithdrawal } from '../services/apiService';

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Strict access check
  useEffect(() => {
    if (!location.state?.fromFunds) {
      navigate('/funds');
    }
  }, [location, navigate]);

  // Data states
  const [investor, setInvestor] = useState(null);
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState([]);

  // Export CSV states
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Fetch initial data
  useEffect(() => {
    const fetchAllData = async () => {
      const invData = await getInvestorDetails();
      const prodData = await getProducts();
      const histData = await getWithdrawalHistory();
      
      setInvestor(invData);
      setProducts(prodData);
      setHistory(histData);

      // Set initial selected product if available
      if (prodData.length > 0) {
        setSelectedProductId(prodData[0].id);
      }
    };
    fetchAllData();
  }, []);

  if (!investor || products.length === 0) {
    return <div>Loading withdrawal details...</div>;
  }

  // Handle form validation and submission
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); // Reset errors
    const validationErrors = [];
    const withdrawAmount = parseFloat(amount);

    // Find the selected product details
    const product = products.find(p => p.id === selectedProductId);

    if (!product) {
      validationErrors.push("ERROR: Invalid product selected.");
    } else {
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        validationErrors.push("ERROR: Please enter a valid withdrawal amount.");
      } else {
        // Rule 1: Retirement withdrawals only allowed if age > 65
        if (product.type === "RETIREMENT" && investor.age <= 65) {
          validationErrors.push("ERROR: Retirement withdrawals only allowed if age > 65");
        }
        
        // Rule 2: Withdrawal must not exceed balance
        if (withdrawAmount > product.balance) {
          validationErrors.push("ERROR: Withdrawal must not exceed balance");
        }
        
        // Rule 3: Withdrawal must not exceed 90% of balance
        if (withdrawAmount > (product.balance * 0.9)) {
          validationErrors.push("ERROR: Withdrawal must not exceed 90% of balance");
        }
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return; // Stop submission
    }

    // Process withdrawal if validation passes
    const result = await submitWithdrawal({
      productId: product.id,
      productName: product.name,
      amount: withdrawAmount
    });

    if (result) {
      // Refresh the history and product balances after successful withdrawal
      const updatedProdData = await getProducts();
      const updatedHistData = await getWithdrawalHistory();
      setProducts(updatedProdData);
      setHistory(updatedHistData);
      setAmount(''); // Reset input field
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/funds')}>Back</button>
      
      <h1>Withdraw Funds</h1>

      <div>
        <h2>Withdrawal Form</h2>
        <form onSubmit={handleWithdrawSubmit}>
          <div>
            <label>Select Account/Product: </label>
            <select 
              value={selectedProductId} 
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Balance: ${p.balance})
                </option>
              ))}
            </select>
          </div>
          <br />
          <div>
            <label>Amount: </label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter amount"
            />
          </div>
          <br />
          <button type="submit">Submit Withdrawal</button>
        </form>

        {/* Display validation failures as plain text error messages */}
        {errors.length > 0 && (
          <div>
            {errors.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}
      </div>

      <hr />

      <div>
        <h2>Past Historical Data</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.product}</td>
                <td>${item.amount}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />

        <button onClick={() => setShowExportOptions(!showExportOptions)}>
          Export CSV
        </button>

        {/* Export CSV Options */}
        {showExportOptions && (
          <div>
            <br />
            <label>From Date: </label>
            <input 
              type="date" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
            />
            
            <label> To Date: </label>
            <input 
              type="date" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
            />
            
            <button onClick={() => alert('Download initiated...')}>Download</button>
          </div>
        )}
      </div>
    </div>
  );
}
