import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { userSignup } from 'src/app/models/userSignup.model';
import { CurrencyService } from 'src/app/services/currency.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  loggedUser!: userSignup | undefined;
  wsSubscription!: Subscription;
  cryptoList: { symbol: string; price_high: number; price_low: number }[] = [];

  ngOnInit(): void {
    this.loggedUser = this.authService.loggedInUser;
    if (!this.wsSubscription) this.connectWebSocket();
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private currService: CurrencyService
  ) {}
  logout() {
    this.authService.onLogout();
    this.router.navigate(['loginpage/login']);
  }
  connectWebSocket(): void {
    if (this.loggedUser && this.loggedUser.saved) {
      this.wsSubscription = this.currService
        .wsConnect(this.loggedUser.saved)
        .subscribe(
          (message) => {
            console.log('webSocket', message);
            this.updateCryptoList(message);
          },
          (error) => console.error('error:', error),
          () => console.log('done')
        );
    }
  }

  updateCryptoList(message: any): void {
    const { symbol_id, price_high, price_low } = message;
    const symbolParts = symbol_id.split('_');
    const currencySymbol = symbolParts[2];

    const existingCrypto = this.cryptoList.find(
      (crypto) => crypto.symbol === currencySymbol
    );

    if (existingCrypto) {
      existingCrypto.price_high = price_high;
      existingCrypto.price_low = price_low;
    } else {
      this.cryptoList.push({ symbol: currencySymbol, price_high, price_low });
    }
    console.log(this.cryptoList);
  }

  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
    this.currService.wsClose();
  }

  onCloseSavedCurr(symbolId: string): void {
    console.log('Symbol ID to remove:', symbolId);

    const savedCurrencies: string[] = JSON.parse(
      localStorage.getItem('saved') || '[]'
    );
    console.log('Saved currencies before removal:', savedCurrencies);

    this.cryptoList = this.cryptoList.filter(
      (crypto) => crypto.symbol !== symbolId
    );
    console.log('Crypto list after removal:', this.cryptoList);

    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }

    const updatedSavedCurrencies = savedCurrencies.filter(
      (symbol) => symbol !== symbolId
    );
    console.log('Updated saved currencies:', updatedSavedCurrencies);

    localStorage.setItem('saved', JSON.stringify(updatedSavedCurrencies));
  }
}
