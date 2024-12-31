export const accounts = [
  {
    id: 1,
    account_name: 'Visa Card',
    account_type: 'Credit Card',
    description: 'Personal credit card for everyday purchases.',
    last_import_date: '2024-10-20',
    provider: 'Bank of America',
  },
  {
    id: 2,
    account_name: 'MasterCard',
    account_type: 'Credit Card',
    description: 'Business credit card with cashback rewards.',
    last_import_date: '2024-10-15',
    provider: 'Chase Bank',
  },
  {
    id: 3,
    account_name: 'Discover Card',
    account_type: 'Credit Card',
    description: null, // No description provided
    last_import_date: '2024-10-10',
    provider: 'Discover Financial Services',
  },
  {
    id: 4,
    account_name: 'American Express',
    account_type: 'Charge Card',
    description: 'Premium charge card with travel benefits.',
    last_import_date: '2024-10-12',
    provider: 'American Express',
  },
  {
    id: 5,
    account_name: 'Capital One Quicksilver',
    account_type: 'Credit Card',
    description: 'No annual fee with unlimited 1.5% cashback.',
    last_import_date: '2024-10-01',
    provider: 'Capital One',
  },
];

export const transaction_categories = [
  {
    id: 1,
    category: 'Housing',
    category_type: 1,
    category_type_text: 'Expenses',
    description: 'Housing .',
  },
  {
    id: 2,
    category: 'Transportation',
    category_type: 2,
    category_type_text: 'Expense',
    description: 'Transportation',
  },
  {
    id: 3,
    category: 'Savings',
    category_type: 3,
    category_type_text: 'Saving',
    description: 'Funds set aside for future use.',
  },
  {
    id: 4,
    category: 'Groceries',
    category_type: 2,
    category_type_text: 'Expense',
    description: 'Spending on food and household supplies.',
  },
  {
    id: 5,
    category: 'Utilities',
    category_type: 2,
    category_type_text: 'Expense',
    description: 'Payments for services like electricity, water, and gas.',
  },
  {
    id: 6,
    category: 'Entertainment',
    category_type: 2,
    category_type_text: 'Expense',
    description: 'Spending on leisure activities and events.',
  },
  {
    id: 7,
    category: 'Investments',
    category_type: 3,
    category_type_text: 'Saving',
    description: 'Funds allocated for investment purposes.',
  },
  {
    id: 8,
    category: 'Health',
    category_type: 2,
    category_type_text: 'Expense',
    description: 'Spending on medical and health-related expenses.',
  },
  {
    id: 9,
    category: 'Salary',
    category_type: 1,
    category_type_text: 'Income',
    description: 'Monthly earnings from employment.',
  },
  {
    id: 10,
    category: 'Miscellaneous',
    category_type: 2,
    category_type_text: 'Expense',
    description: 'Uncategorized or unexpected expenses.',
  },
];

export const transaction_subcategories = [
  {
    id: 1,
    name: 'Rent',
    category: 1,
    category_text: 'Housing',
    description: 'Monthly rent.',
  },
  {
    id: 2,
    name: 'Fuel',
    category: 2,
    category_text: 'Transportation',
    description: 'fuel.',
  },
  {
    id: 3,
    name: 'Emergency fund',
    category: 3,
    category_text: 'Savings',
    description: 'emergency fund',
  },
];

export const initSettings = {
  accounts: accounts,
  transaction_categories: transaction_categories,
  transaction_sub_categories: transaction_subcategories,
};
