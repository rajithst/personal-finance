import { DropDownType } from '../interface/common.data';

export const SAVINGS_CATEGORY_ID = 6;
export const PAYMENT_CATEGORY_ID = 14;
export const NA_CATEGORY_ID = 1000;
export const NA_SUB_CATEGORY_ID = 1000;
export const INCOME_CATEGORIES: DropDownType[] = [
  { value: 1, viewValue: 'Salary/Wages' },
  { value: 2, viewValue: 'Freelance Income' },
  { value: 3, viewValue: 'Investment Income' },
  { value: 4, viewValue: 'Rental Income' },
  { value: 5, viewValue: 'Side Gig Income' },
  { value: 6, viewValue: 'Interest Income' },
  { value: 7, viewValue: 'Bonus/Commission' },
  { value: 8, viewValue: 'Gifts/Donations' },
  { value: 9, viewValue: 'Government Assistance' },
  { value: 10, viewValue: 'Other' },
];

export const PAYMENT_METHODS: DropDownType[] = [
  { value: 1, viewValue: 'Rakuten Card' },
  { value: 2, viewValue: 'EPOS Card' },
  { value: 3, viewValue: 'DOCOMO Card' },
  { value: 4, viewValue: 'Cash' },
];

export const TRANSACTION_CATEGORIES: DropDownType[] = [
  { value: 1000, viewValue: 'N/A' },
  { value: 1, viewValue: 'Housing' },
  { value: 2, viewValue: 'Transportation' },
  { value: 3, viewValue: 'Food' },
  { value: 4, viewValue: 'Utilities' },
  { value: 5, viewValue: 'Taxes' },
  { value: 6, viewValue: 'Savings' },
  { value: 7, viewValue: 'Entertainment' },
  { value: 8, viewValue: 'Shopping' },
  { value: 9, viewValue: 'Clothing and Accessories' },
  { value: 10, viewValue: 'Personal Care' },
  { value: 11, viewValue: 'Healthcare' },
  { value: 12, viewValue: 'Insurance' },
  { value: 13, viewValue: 'Education' },
  { value: 14, viewValue: 'Cash Payments' },
  { value: 15, viewValue: 'Charitable Giving' },
  { value: 16, viewValue: 'Miscellaneous' },
];

export const TRANSACTION_SUB_CATEGORIES: { [key: number]: DropDownType[] } = {
  1000: [{ value: 1000, viewValue: 'N/A' }],
  1: [
    { value: 1, viewValue: 'Mortgage/Rent' },
    { value: 2, viewValue: 'Home/Parking Management fees' },
    { value: 3, viewValue: 'Home Insurance' },
    { value: 4, viewValue: 'Home Repairs/Maintenance' },
  ],
  2: [
    { value: 5, viewValue: 'Car Payment' },
    { value: 6, viewValue: 'Auto Insurance' },
    { value: 7, viewValue: 'Fuel/Gas' },
    { value: 8, viewValue: 'Maintenance/Repairs' },
    { value: 9, viewValue: 'Public Transportation' },
    { value: 10, viewValue: 'Parking' },
    { value: 11, viewValue: 'Tolls' },
    { value: 12, viewValue: 'Car Rental' },
  ],
  3: [
    { value: 13, viewValue: 'Groceries' },
    { value: 14, viewValue: 'Dining Out' },
    { value: 15, viewValue: 'Snacks/Coffee' },
  ],
  4: [
    { value: 16, viewValue: 'Electricity' },
    { value: 17, viewValue: 'Gas' },
    { value: 18, viewValue: 'Water' },
    { value: 19, viewValue: 'Internet' },
    { value: 20, viewValue: 'Phone/Mobile' },
    { value: 21, viewValue: 'Cable/TV' },
  ],
  5: [
    { value: 22, viewValue: 'Income Tax' },
    { value: 23, viewValue: 'Residence Tax' },
    { value: 24, viewValue: 'Property Tax' },
    { value: 25, viewValue: 'Vehicle Tax' },
    { value: 26, viewValue: 'Other' },
  ],
  6: [
    { value: 27, viewValue: 'Emergency Fund' },
    { value: 28, viewValue: 'Investments (Securities)' },
    { value: 29, viewValue: 'Retirement Savings' },
    { value: 30, viewValue: 'Cash Deposits' },
  ],
  7: [
    { value: 31, viewValue: 'Subscriptions' },
    { value: 32, viewValue: 'Movies/Theater/Concerts' },
    { value: 33, viewValue: 'Entrance Tickets' },
    { value: 34, viewValue: 'Hobbies' },
    { value: 35, viewValue: 'Vacations/Travel' },
  ],
  8: [
    { value: 36, viewValue: 'Household Items' },
    { value: 37, viewValue: 'Furniture' },
    { value: 38, viewValue: 'Electronics' },
    { value: 39, viewValue: 'Miscellaneous' },
  ],
  9: [
    { value: 40, viewValue: 'Clothing Purchases' },
    { value: 41, viewValue: 'Shoes Purchases' },
    { value: 42, viewValue: 'Dry Cleaning/Laundry' },
  ],
  10: [
    { value: 43, viewValue: 'Haircuts/Salon' },
    { value: 44, viewValue: 'Cosmetics/Toiletries' },
    { value: 45, viewValue: 'Gym Memberships' },
  ],
  11: [
    { value: 46, viewValue: 'Health Insurance Premiums' },
    { value: 47, viewValue: 'Medical/Dental/Vision Expenses' },
    { value: 48, viewValue: 'Prescriptions/Medications' },
    { value: 49, viewValue: 'Health Club Memberships' },
  ],
  12: [
    { value: 50, viewValue: 'Life Insurance' },
    { value: 51, viewValue: 'Disability Insurance' },
    { value: 52, viewValue: 'Long-Term Care Insurance' },
  ],
  13: [
    { value: 53, viewValue: 'Educational Courses' },
    { value: 54, viewValue: 'Tuition/Fees' },
    { value: 55, viewValue: 'Books/Supplies' },
  ],
  14: [
    { value: 56, viewValue: 'Personal Loan Payments' },
    { value: 57, viewValue: 'Credit Card Payments' },
    { value: 58, viewValue: 'Cash Payments' },
  ],
  15: [{ value: 59, viewValue: 'Donations to Charities/Organizations' }],
  16: [
    { value: 60, viewValue: 'Gifts' },
    { value: 61, viewValue: 'Pet Expenses' },
    { value: 62, viewValue: 'Bank Fees' },
    { value: 63, viewValue: 'Postal Fees' },
    { value: 64, viewValue: 'Legal/Professional Fees' },
  ],
};

export const SAVING_CATEGORIES: DropDownType[] = [
  { value: 1, viewValue: 'Emergency Fund' },
  { value: 2, viewValue: 'Investments (Securities)' },
  { value: 3, viewValue: 'Retirement Savings' },
  { value: 4, viewValue: 'Cash Deposits' },
];
export const MONTHS: DropDownType[] = [
  {
    value: 1,
    viewValue: 'January',
  },
  {
    value: 2,
    viewValue: 'February',
  },
  {
    value: 3,
    viewValue: 'March',
  },
  {
    value: 4,
    viewValue: 'April',
  },
  {
    value: 5,
    viewValue: 'May',
  },
  {
    value: 6,
    viewValue: 'June',
  },
  {
    value: 7,
    viewValue: 'July',
  },
  {
    value: 8,
    viewValue: 'August',
  },
  {
    value: 9,
    viewValue: 'September',
  },
  {
    value: 10,
    viewValue: 'October',
  },
  {
    value: 11,
    viewValue: 'November',
  },
  {
    value: 12,
    viewValue: 'December',
  },
];

export const YEARS: DropDownType[] = [
  {
    value: 2024,
    viewValue: '2024',
  },
  {
    value: 2023,
    viewValue: '2023',
  },
  {
    value: 2022,
    viewValue: '2022',
  },
  {
    value: 2021,
    viewValue: '2022',
  },
  {
    value: 2020,
    viewValue: '2020',
  },
];
