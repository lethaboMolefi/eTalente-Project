import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getInvestorDetails, getProducts, getWithdrawalHistory, submitWithdrawal } from '../services/apiService';

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.fromFunds) {
      navigate('/funds');
    }
  }, [location, navigate]);

  const [investor, setInvestor] = useState(null);
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState([]);

  const [showExportOptions, setShowExportOptions] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      const invData = await getInvestorDetails();
      const prodData = await getProducts();
      const histData = await getWithdrawalHistory();
      
      setInvestor(invData);
      setProducts(prodData);
      setHistory(histData);

      if (prodData.length > 0) {
        setSelectedProductId(prodData[0].id);
      }
    };
    fetchAllData();
  }, []);

  if (!investor || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading withdrawal details...
      </div>
    );
  }

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const validationErrors = [];
    const withdrawAmount = parseFloat(amount);
    const product = products.find(p => p.id === selectedProductId);

    if (!product) {
      validationErrors.push("Invalid product selected.");
    } else {
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        validationErrors.push("Please enter a valid withdrawal amount.");
      } else {
        if (product.type === "RETIREMENT" && investor.age <= 65) {
          validationErrors.push("Retirement withdrawals only allowed if age > 65.");
        }
        if (withdrawAmount > product.balance) {
          validationErrors.push("Withdrawal must not exceed balance.");
        }
        if (withdrawAmount > (product.balance * 0.9)) {
          validationErrors.push("Withdrawal must not exceed 90% of balance.");
        }
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await submitWithdrawal({
      productId: product.id,
      productName: product.name,
      amount: withdrawAmount
    });

    if (result) {
      const updatedProdData = await getProducts();
      const updatedHistData = await getWithdrawalHistory();
      setProducts(updatedProdData);
      setHistory(updatedHistData);
      setAmount('');
    }
  };

  const hasErrors = errors.length > 0;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/funds')}
        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 focus:outline-none focus:underline"
      >
        &lt; Back to Fund Management
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Withdraw Funds</h1>
        <p className="text-sm text-gray-500 mt-1">Submit a new withdrawal request or review past transactions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Withdrawal Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 p-5">
              <h2 className="text-lg font-semibold text-gray-900">New Request</h2>
            </div>
            <div className="p-5">
              <form onSubmit={handleWithdrawSubmit} className="space-y-5">
                <div>
                  <label htmlFor="account" className="block text-sm font-medium leading-6 text-gray-900">
                    Select Account
                  </label>
                  <div className="mt-2">
                    <select 
                      id="account"
                      value={selectedProductId} 
                      onChange={(e) => {
                        setSelectedProductId(e.target.value);
                        setErrors([]);
                      }}
                      className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.balance.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
                    Amount ($)
                  </label>
                  <div className="mt-2">
                    <input 
                      type="number" 
                      id="amount"
                      value={amount} 
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setErrors([]);
                      }} 
                      placeholder="0.00"
                      className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6 ${
                        hasErrors ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600'
                      }`}
                    />
                  </div>
                  
                  {/* Validation Errors */}
                  {hasErrors && (
                    <div className="mt-2 text-sm text-red-600 space-y-1">
                      {errors.map((err, index) => (
                        <p key={index}>{err}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                  >
                    Submit Withdrawal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Historical Data Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="border-b border-gray-100 bg-gray-50/50 p-5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
              <button 
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md border border-blue-100"
              >
                {showExportOptions ? 'Close Export' : 'Export CSV'}
              </button>
            </div>

            {/* Export CSV Section - Smooth Expand */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden bg-gray-50 border-b border-gray-100 ${
                showExportOptions ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 flex flex-col sm:flex-row items-end gap-4">
                <div className="w-full sm:w-auto flex-1">
                  <label htmlFor="fromDate" className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
                  <input 
                    type="date" 
                    id="fromDate"
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-white shadow-sm"
                  />
                </div>
                <div className="w-full sm:w-auto flex-1">
                  <label htmlFor="toDate" className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
                  <input 
                    type="date" 
                    id="toDate"
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-white shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => alert('Download initiated...')}
                  className="w-full sm:w-auto rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="overflow-x-auto p-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-5 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {history.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="whitespace-nowrap py-4 pl-5 pr-3 text-sm text-gray-900">{item.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.product}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 text-right">${item.amount.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm">
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-sm text-gray-500">No transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
