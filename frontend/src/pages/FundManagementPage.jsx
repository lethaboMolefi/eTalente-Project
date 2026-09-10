import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvestorDetails } from '../services/apiService';

// Fund Management Page functioning as the Action Hub
export default function FundManagementPage() {
  const navigate = useNavigate();
  const [investor, setInvestor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const data = await getInvestorDetails();
        setInvestor(data);
      } catch (err) {
        setError(err.message || 'Failed to connect to backend.');
      }
    };
    fetchInvestor();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 font-medium">
        Error: {error} (Make sure the Spring Boot backend is running on port 8080)
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading fund management...
      </div>
    );
  }

  const handleWithdrawClick = () => {
    navigate('/withdraw', { state: { fromFunds: true } });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fund Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your accounts and execute transactions</p>
      </div>
      
      {/* Prominent Header Card for Total Amount */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center sm:text-left">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Available Funds</h2>
        <div className="text-5xl font-light text-gray-900">
          R{investor.totalBalance.toLocaleString()}
        </div>
      </div>

      {/* Action Hub Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Invest Action (Disabled) */}
          <button 
            disabled 
            className="group relative flex flex-col items-center justify-center min-h-[160px] bg-white border border-gray-200 rounded-xl cursor-not-allowed overflow-hidden text-center"
          >
            {/* Blurred background content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 blur-[3px] opacity-30 bg-gray-50 pointer-events-none">
              <div className="text-xl font-medium mb-2 text-gray-900">Invest Funds</div>
              <p className="text-sm text-gray-500">Allocate new capital into your selected products.</p>
            </div>
            
            {/* Crisp foreground text overlay */}
            <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
              <span className="font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm w-full">
                Investment functionality coming soon
              </span>
            </div>
          </button>

          {/* Transfer Action (Disabled) */}
          <button 
            disabled 
            className="group relative flex flex-col items-center justify-center min-h-[160px] bg-white border border-gray-200 rounded-xl cursor-not-allowed overflow-hidden text-center"
          >
            {/* Blurred background content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 blur-[3px] opacity-30 bg-gray-50 pointer-events-none">
              <div className="text-xl font-medium mb-2 text-gray-900">Transfer</div>
              <p className="text-sm text-gray-500">Move capital between your existing portfolios.</p>
            </div>
            
            {/* Crisp foreground text overlay */}
            <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
              <span className="font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm w-full">
                Transfer functionality coming soon
              </span>
            </div>
          </button>

          {/* Withdraw Action (Active) */}
          <button 
            onClick={handleWithdrawClick}
            className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer text-center outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="text-xl font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Withdraw Funds</div>
            <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Request a payout to your linked bank account.</p>
          </button>
          
        </div>
      </div>
    </div>
  );
}
