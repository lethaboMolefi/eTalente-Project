// This service acts as the central data layer for the application.
// All mock data and API fetch functions reside here as per requirements.

const mockData = {
  investorDetails: {
    name: "John Doe",
    age: 68,
    totalBalance: 125000,
  },
  products: [
    {
      id: "prod-1",
      name: "Retirement Fund",
      type: "RETIREMENT",
      balance: 100000,
      initialInvestment: 90000,
    },
    {
      id: "prod-2",
      name: "Standard Savings",
      type: "SAVINGS",
      balance: 25000,
      initialInvestment: 26000,
    }
  ],
  withdrawalHistory: [
    {
      id: "w-1",
      date: "2023-01-15",
      product: "Retirement Fund",
      amount: 5000,
      status: "COMPLETED"
    },
    {
      id: "w-2",
      date: "2023-06-20",
      product: "Standard Savings",
      amount: 1000,
      status: "COMPLETED"
    }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getInvestorDetails = async () => {
  await delay(500);
  return mockData.investorDetails;
};

export const getProducts = async () => {
  await delay(500);
  return mockData.products;
};

export const getWithdrawalHistory = async () => {
  await delay(500);
  return mockData.withdrawalHistory;
};

export const submitWithdrawal = async (withdrawalData) => {
  await delay(500);
  // Simulating the withdrawal successfully being processed
  const newWithdrawal = {
    id: `w-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    product: withdrawalData.productName,
    amount: withdrawalData.amount,
    status: "COMPLETED"
  };
  mockData.withdrawalHistory.push(newWithdrawal);

  // Update the balance in mock data
  const product = mockData.products.find(p => p.id === withdrawalData.productId);
  if (product) {
    product.balance -= withdrawalData.amount;
    mockData.investorDetails.totalBalance -= withdrawalData.amount;
  }

  return newWithdrawal;
};
