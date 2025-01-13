import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { CreditAccount } from '../../finance/model/account';
import { ApiService } from '../api.service';
import { Portfolio } from '../../investments/model/portfolio';
import {MonthlyDividend} from "../../investments/model/dividend";

type InvestmentState = {
  brokerAccounts: CreditAccount[];
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  dividends: MonthlyDividend[];
  initLoadPass: boolean;
  loading: boolean;
};

const initialState: InvestmentState = {
  brokerAccounts: [],
  portfolios: [],
  dividends: [],
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
      const settings = await apiService.initInvestmentSettings();
      patchState(store, {
        brokerAccounts: settings.broker_accounts,
        portfolios: settings.portfolios,
        currentPortfolio: settings.portfolios[0] || null,
        initLoadPass: true,
        loading: false,
      });
    },

    async getDividends(portfolioId: number) {
        patchState(store, { loading: true });
        const dividends = await apiService.getDividends(portfolioId);
        patchState(store, { dividends, loading: false });
    }
  })),
);
