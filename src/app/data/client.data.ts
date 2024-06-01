export const SAVINGS_CATEGORY_ID = 6;
export const PAYMENT_CATEGORY_ID = 14;
export const NA_CATEGORY_ID = 1000;
export const NA_SUB_CATEGORY_ID = 1000;

export interface DropDownType {
  value: number;
  viewValue: string;
  checked: boolean;
}

export interface DropDownTypeString {
  value: string;
  viewValue: string;
}

export const TRANSACTION_TYPES: DropDownType[] = [
  { value: 1, viewValue: 'Income', checked: false },
  { value: 2, viewValue: 'Expense', checked: false },
]
export const INCOME_CATEGORIES: DropDownType[] = [
  { value: 1, viewValue: 'Salary/Wages', checked: false },
  { value: 2, viewValue: 'Freelance Income', checked: false },
  { value: 3, viewValue: 'Investment Income', checked: false },
  { value: 4, viewValue: 'Rental Income', checked: false },
  { value: 5, viewValue: 'Side Gig Income', checked: false },
  { value: 6, viewValue: 'Interest Income', checked: false },
  { value: 7, viewValue: 'Bonus/Commission', checked: false },
  { value: 8, viewValue: 'Gifts/Donations', checked: false },
  { value: 9, viewValue: 'Government Assistance', checked: false },
  { value: 10, viewValue: 'Other', checked: false },
];

export const SAVING_CATEGORIES: DropDownType[] = [
  { value: 1, viewValue: 'Emergency Fund', checked: false },
  { value: 2, viewValue: 'Investments (Securities)', checked: false },
  { value: 3, viewValue: 'Retirement Savings', checked: false },
  { value: 4, viewValue: 'Cash Deposits', checked: false },
];

export const PAYMENT_CATEGORIES: DropDownType[] = [
  { value: 1, viewValue: 'Personal Loan Payments', checked: false },
  { value: 2, viewValue: 'Credit Card Payment', checked: false },
  { value: 3, viewValue: 'Cash Payment/Withdrawals', checked: false },
];

export const PAYMENT_METHODS: DropDownType[] = [
  { value: 1, viewValue: 'Rakuten Card', checked: false },
  { value: 2, viewValue: 'EPOS Card', checked: false },
  { value: 3, viewValue: 'DOCOMO Card', checked: false },
  { value: 4, viewValue: 'Cash', checked: false },
];

export const TRANSACTION_CATEGORIES: DropDownType[] = [
  { value: 1000, viewValue: 'N/A', checked: false },
  { value: 1, viewValue: 'Housing', checked: false },
  { value: 2, viewValue: 'Transportation', checked: false },
  { value: 3, viewValue: 'Food', checked: false },
  { value: 4, viewValue: 'Utilities', checked: false },
  { value: 5, viewValue: 'Taxes', checked: false },
  { value: 6, viewValue: 'Savings', checked: false },
  { value: 7, viewValue: 'Entertainment', checked: false },
  { value: 8, viewValue: 'Shopping', checked: false },
  { value: 9, viewValue: 'Clothing and Accessories', checked: false },
  { value: 10, viewValue: 'Personal Care', checked: false },
  { value: 11, viewValue: 'Healthcare', checked: false },
  { value: 12, viewValue: 'Insurance', checked: false },
  { value: 13, viewValue: 'Education', checked: false },
  { value: 14, viewValue: 'Cash Payments', checked: false },
  { value: 15, viewValue: 'Charitable Giving', checked: false },
  { value: 16, viewValue: 'Miscellaneous', checked: false },
];

export const TRANSACTION_SUB_CATEGORIES: { [key: number]: DropDownType[] } = {
  1000: [{ value: 1000, viewValue: 'N/A', checked: false }],
  1: [
    { value: 1, viewValue: 'Mortgage/Rent', checked: false },
    { value: 2, viewValue: 'Home/Parking Management fees', checked: false },
    { value: 3, viewValue: 'Home Insurance', checked: false },
    { value: 4, viewValue: 'Home Repairs/Maintenance', checked: false },
  ],
  2: [
    { value: 5, viewValue: 'Car Payment', checked: false },
    { value: 6, viewValue: 'Auto Insurance', checked: false },
    { value: 7, viewValue: 'Fuel/Gas', checked: false },
    { value: 8, viewValue: 'Maintenance/Repairs', checked: false },
    { value: 9, viewValue: 'Public Transportation', checked: false },
    { value: 10, viewValue: 'Parking', checked: false },
    { value: 11, viewValue: 'Tolls', checked: false },
    { value: 12, viewValue: 'Car Rental', checked: false },
  ],
  3: [
    { value: 13, viewValue: 'Groceries', checked: false },
    { value: 14, viewValue: 'Dining Out', checked: false },
    { value: 15, viewValue: 'Snacks/Coffee', checked: false },
  ],
  4: [
    { value: 16, viewValue: 'Electricity', checked: false },
    { value: 17, viewValue: 'Gas', checked: false },
    { value: 18, viewValue: 'Water', checked: false },
    { value: 19, viewValue: 'Internet', checked: false },
    { value: 20, viewValue: 'Phone/Mobile', checked: false },
    { value: 21, viewValue: 'Cable/TV', checked: false },
  ],
  5: [
    { value: 22, viewValue: 'Income Tax', checked: false },
    { value: 23, viewValue: 'Residence Tax', checked: false },
    { value: 24, viewValue: 'Property Tax', checked: false },
    { value: 25, viewValue: 'Vehicle Tax', checked: false },
    { value: 26, viewValue: 'Other', checked: false },
  ],
  6: [
    { value: 27, viewValue: 'Emergency Fund', checked: false },
    { value: 28, viewValue: 'Investments (Securities)', checked: false },
    { value: 29, viewValue: 'Retirement Savings', checked: false },
    { value: 30, viewValue: 'Cash Deposits', checked: false },
  ],
  7: [
    { value: 31, viewValue: 'Subscriptions', checked: false },
    { value: 32, viewValue: 'Movies/Theater/Concerts', checked: false },
    { value: 33, viewValue: 'Entrance Tickets', checked: false },
    { value: 34, viewValue: 'Hobbies', checked: false },
    { value: 35, viewValue: 'Vacations/Travel', checked: false },
  ],
  8: [
    { value: 36, viewValue: 'Household Items', checked: false },
    { value: 37, viewValue: 'Furniture', checked: false },
    { value: 38, viewValue: 'Electronics', checked: false },
    { value: 39, viewValue: 'Miscellaneous', checked: false },
  ],
  9: [
    { value: 40, viewValue: 'Clothing Purchases', checked: false },
    { value: 41, viewValue: 'Shoes Purchases', checked: false },
    { value: 42, viewValue: 'Dry Cleaning/Laundry', checked: false },
  ],
  10: [
    { value: 43, viewValue: 'Haircuts/Salon', checked: false },
    { value: 44, viewValue: 'Cosmetics/Toiletries', checked: false },
    { value: 45, viewValue: 'Gym Memberships', checked: false },
  ],
  11: [
    { value: 46, viewValue: 'Health Insurance Premiums', checked: false },
    { value: 47, viewValue: 'Medical/Dental/Vision Expenses', checked: false },
    { value: 48, viewValue: 'Prescriptions/Medications', checked: false },
    { value: 49, viewValue: 'Health Club Memberships', checked: false },
  ],
  12: [
    { value: 50, viewValue: 'Life Insurance', checked: false },
    { value: 51, viewValue: 'Disability Insurance', checked: false },
    { value: 52, viewValue: 'Long-Term Care Insurance', checked: false },
  ],
  13: [
    { value: 53, viewValue: 'Educational Courses', checked: false },
    { value: 54, viewValue: 'Tuition/Fees', checked: false },
    { value: 55, viewValue: 'Books/Supplies', checked: false },
  ],
  14: [
    { value: 56, viewValue: 'Personal Loan Payments', checked: false },
    { value: 57, viewValue: 'Credit Card Payments', checked: false },
    { value: 58, viewValue: 'Cash Payments', checked: false },
  ],
  15: [{ value: 59, viewValue: 'Donations to Charities/Organizations', checked: false }],
  16: [
    { value: 60, viewValue: 'Gifts', checked: false },
    { value: 61, viewValue: 'Pet Expenses', checked: false },
    { value: 62, viewValue: 'Bank Fees', checked: false },
    { value: 63, viewValue: 'Postal Fees', checked: false },
    { value: 64, viewValue: 'Legal/Professional Fees', checked: false },
  ],
};




export const MONTHS: DropDownType[] = [
  { value: 1, viewValue: 'January', checked: false },
  { value: 2, viewValue: 'February', checked: false },
  { value: 3, viewValue: 'March', checked: false },
  { value: 4, viewValue: 'April', checked: false },
  { value: 5, viewValue: 'May', checked: false },
  { value: 6, viewValue: 'June', checked: false },
  { value: 7, viewValue: 'July', checked: false },
  { value: 8, viewValue: 'August', checked: false },
  { value: 9, viewValue: 'September', checked: false },
  { value: 10, viewValue: 'October', checked: false },
  { value: 11, viewValue: 'November', checked: false },
  { value: 12, viewValue: 'December', checked: false },
];

export const YEARS: DropDownType[] = [
  { value: 2024, viewValue: '2024', checked: false },
  { value: 2023, viewValue: '2023', checked: false },
  { value: 2022, viewValue: '2022', checked: false },
  { value: 2021, viewValue: '2021', checked: false },
  { value: 2020, viewValue: '2020', checked: false },
];
