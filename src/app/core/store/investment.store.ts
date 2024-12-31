import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { CreditAccount } from '../../finance/model/account';
import { ApiService } from '../api.service';
import { Portfolio } from '../../investments/model/portfolio';

type InvestmentState = {
  brokerAccounts: CreditAccount[];
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  initLoadPass: boolean;
  loading: boolean;
};

const initialState: InvestmentState = {
  brokerAccounts: [],
  portfolios: [],
  currentPortfolio: null,
  initLoadPass: false,
  loading: false,
};

export const InvestmentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, apiService = inject(ApiService)) => ({

    async switchPortfolio(portfolioId: number) {
      try {
        patchState(store, { loading: true });
        const portfolio = store.portfolios().find((p) => p.id === portfolioId);
        patchState(store, { currentPortfolio: portfolio });
        patchState(store, { loading: false });
        return true;
      } catch (error) {
        console.error(error);
        patchState(store, { loading: false });
        return false;
      }
    },

    async createPortfolio(portfolio: Portfolio) {
      patchState(store, { loading: true });
      const updatedPortfolio = await apiService.createPortfolio(portfolio);
      if (updatedPortfolio) {
        patchState(store, { currentPortfolio: updatedPortfolio });
        patchState(store, {
          portfolios: [...store.portfolios(), updatedPortfolio],
          loading: false,
        });
      }
      return updatedPortfolio;

    },

    async getClientSettings() {
      console.log('getClientSettings');
      const settings = await apiService.initInvestmentSettings();
      console.log('settings ', settings);
      patchState(store, {
        brokerAccounts: settings.broker_accounts,
        portfolios: settings.portfolios,
        currentPortfolio: settings.portfolios[0] || null,
        initLoadPass: true,
        loading: false,
      });
    },
  })),
);
