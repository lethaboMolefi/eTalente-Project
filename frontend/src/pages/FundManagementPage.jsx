import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvestorDetails } from '../services/apiService';

// Fund Management Page functioning as the Action Hub
export default function FundManagementPage() {
  const navigate = useNavigate();
  
  // State for holding investor details
  const [investor, setInvestor] = useState(null);

  // Fetch investor data on mount to display total balance
  useEffect(() => {
    const fetchInvestor = async () => {
      const data = await getInvestorDetails();
      setInvestor(data);
    };
    fetchInvestor();
  }, []);

  if (!investor) {
    return <div>Loading fund management...</div>;
  }

  // Handle navigation to the Withdrawal page
  const handleWithdrawClick = () => {
    navigate('/withdraw', { state: { fromFunds: true } });
  };

  return (
    <div>
      <h1>Fund Management Page (Action Hub)</h1>
      
      {/* Display total combined amount available */}
      <div>
        <h2>Total Combined Amount Available</h2>
        <p>${investor.totalBalance}</p>
      </div>

      <hr />

      {/* Main user actions */}
      <div>
        <h2>Actions</h2>
        
        {/* Disabled actions */}
        <button disabled>Invest (Coming Soon)</button>
        <br /><br />
        <button disabled>Transfer (Coming Soon)</button>
        <br /><br />
        
        {/* Active action navigating to withdrawal page */}
        <button onClick={handleWithdrawClick}>Withdraw</button>
      </div>
    </div>
  );
}
