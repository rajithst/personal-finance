import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { CreditAccount } from '../../finance/model/account';
import { ApiService } from '../api.service';
import { Portfolio } from '../../investments/model/portfolio';

type InvestmentState = {
  brokerAccounts: CreditAccount[];
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  loading: boolean;
};

const initialState: InvestmentState = {
  brokerAccounts: [],
  portfolios: [],
  currentPortfolio: null,
  loading: false,
};

export const InvestmentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, apiService = inject(ApiService)) => ({
    async getClientSettings() {
      const settings = await apiService.initInvestmentSettings();
      patchState(store, {
        brokerAccounts: settings.broker_accounts,
        portfolios: settings.portfolios,
        currentPortfolio: settings.portfolios[0] || null,
        loading: false,
      });
    },
  })),
);
