

export const TransactionColumnMap: { [key: string]: string } = {
  'amount': 'Amount',
  'date': 'Date',
  'destination': 'Destination',
  'alias': 'Alias',
  'notes': 'Notes',
  'is_saving': 'Saving',
  'is_payment': 'Payment',
  'is_expense': 'Expense',
  'is_income': 'Income',
  'is_deleted': 'Deleted',
  'is_merge': 'Merge',
  'merge_id': 'Merge ID',
  'category': 'Category',
  'subcategory': 'Subcategory',
  'account': 'Account',
}

export const TransactionRelatedColumns: { [key: string]: string } = {
  'category': 'Category',
  'subcategory': 'Subcategory',
  'account': 'Account',
  'user': 'User',
}
