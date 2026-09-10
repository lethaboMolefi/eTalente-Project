const API_BASE_URL = 'http://localhost:8080/api/v1';

// Helper to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Network response was not ok';
    try {
      const errorData = await response.json();
      // Combine validation error messages if they exist
      if (errorData && typeof errorData === 'object') {
        const errors = Object.values(errorData);
        if (errors.length > 0) {
            errorMessage = errors.join(', ');
        } else if (errorData.error) {
            errorMessage = errorData.error;
        }
      }
    } catch (e) {
      // Fallback to text or default message
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const getInvestorDetails = async () => {
  const data = await fetch(`${API_BASE_URL}/portfolio`).then(handleResponse);
  return {
    name: data.investorName,
    age: data.investorAge,
    totalBalance: data.totalBalance
  };
};

export const getProducts = async () => {
  const data = await fetch(`${API_BASE_URL}/portfolio`).then(handleResponse);
  return data.products;
};

export const getWithdrawalHistory = async () => {
  const data = await fetch(`${API_BASE_URL}/portfolio`).then(handleResponse);
  return data.withdrawalHistory;
};

export const submitWithdrawal = async (withdrawalData) => {
  const response = await fetch(`${API_BASE_URL}/withdrawals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: withdrawalData.productId,
      amount: withdrawalData.amount
    }),
  });
  
  return handleResponse(response);
};

export const exportWithdrawalsCsv = (fromDate, toDate) => {
  let url = `${API_BASE_URL}/withdrawals/export`;
  const params = new URLSearchParams();
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  // Directly open the export endpoint which triggers a file download in the browser
  window.open(url, '_blank');
};
