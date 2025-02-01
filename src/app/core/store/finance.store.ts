import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Payee, PayeeUpdateRequest } from '../../finance/model/payee';
import {
  AccountProvider,
  TransactionCategory,
  TransactionSubCategory,
} from '../../finance/model/common';
import {
  CreditAccount,
  CreditAccountRequest,
} from '../../finance/model/account';
import { ApiService } from '../api.service';
import {
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
} from '../../finance/data/client.data';
import { CategorySettingsRequest } from '../../finance/model/category-settings';

type FinanceState = {
  payees: Payee[];
  transactionCategories: TransactionCategory[];
  transactionSubCategories: TransactionSubCategory[];
  creditAccounts: CreditAccount[];
  accountTypes: string[];
  accountProviders: AccountProvider[];
  initLoadPass: boolean;
  loading: boolean;
};

const initialState: FinanceState = {
  payees: [],
  transactionCategories: [],
  transactionSubCategories: [],
  creditAccounts: [],
  accountTypes: [],
  accountProviders: [],
  initLoadPass: false,
  loading: false,
};

export const FinanceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, apiService = inject(ApiService)) => ({
    async getPayees() {
      const payees = await apiService.getPayees();
      patchState(store, { payees: payees });
    },

    async updatePayee(payee: PayeeUpdateRequest) {
      try {
        patchState(store, { loading: true });
        const updatedPayee = await apiService.updatePayeeRules(payee);
        const newPayee = updatedPayee.payee ?? payee;
        if (payee.id !== null) {

          const payees = store
            .payees()
            .map((x) => (x.id === payee.id ? newPayee : x));
          patchState(store, { payees });
        } else {
          patchState(store, { payees: [...store.payees(), newPayee] });
        }
        return updatedPayee;
      } catch (error) {
        patchState(store, { loading: false });
        return null;
      }
    },

    async getClientSettings() {
      const settings = await apiService.initSettings();
      patchState(store, {
        transactionCategories: settings.transaction_categories,
        transactionSubCategories: settings.transaction_subcategories,
        creditAccounts: settings.accounts,
        accountTypes: settings.account_types,
        accountProviders: settings.account_providers,
        initLoadPass: true,
      });
    },

    async updateCreditAccount(account: CreditAccountRequest) {
      try {
        patchState(store, { loading: true });
        const updatedAccount = await apiService.updateCreditAccount(account);
        if (account.id !== null) {
          const accounts = store
            .creditAccounts()
            .map((x) => (x.id === account.id ? updatedAccount : x));
          patchState(store, { creditAccounts: accounts });
        } else {
          patchState(store, {
            creditAccounts: [...store.creditAccounts(), updatedAccount],
          });
        }
        return updatedAccount;
      } catch (error) {
        patchState(store, { loading: false });
        return null;
      }
    },

    async updateCategory(category: CategorySettingsRequest) {
      try {
        const updatedCategory = await apiService.updateCategory(category);
        if (category.category.id !== null) {
          if (updatedCategory.category !== null) {
            const categories = store
              .transactionCategories()
              .map((x) =>
                x.id === category.category.id ? updatedCategory.category! : x,
              );
            const subcategories = store
              .transactionSubCategories()
              .filter((x) => x.category !== category.category.id);

            patchState(store, { transactionCategories: categories });
            patchState(store, {
              transactionSubCategories: [
                ...subcategories,
                ...updatedCategory.subcategories,
              ],
            });
          } else {
            const categories = store
              .transactionCategories()
              .filter((x) => x.id !== category.category.id);
            patchState(store, { transactionCategories: categories });
          }
        } else {
          if (updatedCategory.category !== null) {
            patchState(store, {
              transactionCategories: [
                ...store.transactionCategories(),
                updatedCategory.category,
              ],
            });
          }
          if (
            updatedCategory.subcategories !== null &&
            updatedCategory.subcategories.length > 0
          ) {
            patchState(store, {
              transactionSubCategories: [
                ...store.transactionSubCategories(),
                ...updatedCategory.subcategories,
              ],
            });
          }
        }
        return updatedCategory;
      } catch (error) {
        patchState(store, { loading: false });
        return null;
      }
    },

    async deleteCategory(categoryId: number) {
      try {
        patchState(store, { loading: true });
        const response = await apiService.deleteCategory(categoryId);
        if (response) {
          const categories = store
            .transactionCategories()
            .filter((x) => x.id !== categoryId);
          const subcategories = store
            .transactionSubCategories()
            .filter((x) => x.category !== categoryId);
          patchState(store, { transactionCategories: categories });
          patchState(store, { transactionSubCategories: subcategories });
        }
        return response;
      } catch (error) {
        patchState(store, { loading: false });
        return false;
      }
    },
  })),
  withComputed((store) => ({
    incomeCategories: computed(() =>
      store
        .transactionCategories()
        .filter((x) => x.category_type === TRANSACTION_TYPE_INCOME_ID),
    ),
    expenseCategories: computed(() =>
      store
        .transactionCategories()
        .filter((x) => x.category_type === TRANSACTION_TYPE_EXPENSE_ID),
    ),
    paymentCategories: computed(() =>
      store
        .transactionCategories()
        .filter((x) => x.category_type === TRANSACTION_TYPE_PAYMENTS_ID),
    ),
    savingsCategories: computed(() =>
      store
        .transactionCategories()
        .filter((x) => x.category_type === TRANSACTION_TYPE_SAVINGS_ID),
    ),
  })),
);
