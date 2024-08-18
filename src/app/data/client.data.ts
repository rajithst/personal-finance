import { DropDownType } from './shared.data';

export const SAVINGS_CATEGORY_ID = 6;
export const PAYMENT_CATEGORY_ID = 14;
export const NA_CATEGORY_ID = 1000;
export const NA_SUB_CATEGORY_ID = 1000;

export const SUCCESS_ACTION: string = 'UPDATE_ACTION';
export const ERROR_ACTION: string = 'ERROR_ACTION';
export const CANCEL_ACTION: string = 'CANCEL_ACTION';

export const UPDATE_SUCCESS_ALERT: string = 'Successfully updated.';
export const UPDATE_ERROR_ALERT: string = 'Failed to update.';
export const CANCEL_UPDATE_ALERT: string = 'Failed to update.';

export const TRANSACTION_TYPES: DropDownType[] = [
  { value: 1, viewValue: 'Income', checked: false },
  { value: 2, viewValue: 'Expense', checked: false },
  { value: 3, viewValue: 'Payment', checked: false },
];


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

