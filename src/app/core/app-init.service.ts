import {inject, Injectable} from "@angular/core";
import {FinanceStore} from "./store/finance.store";
import {InvestmentStore} from "./store/investment.store";
import {AuthStore} from "../auth/auth.store";

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  private readonly financeStore = inject(FinanceStore);
  private readonly investmentStore = inject(InvestmentStore);
  private readonly authStore = inject(AuthStore);

  async appInit() {
    const isAvailable = await this.authStore.init();
    if (isAvailable) {
      await this.financeStore.getClientSettings();
      await this.investmentStore.getClientSettings();
    }

  }

}
