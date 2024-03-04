import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { userSignup } from 'src/app/models/userSignup.model';
import { CurrencyService } from 'src/app/services/currency.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  loggedUser!: userSignup | null;
  wsSubscription!: Subscription;
  cryptoList: { symbol: string; price_high?: number; price_low?: number }[] =
    [];
  authSub!: Subscription;

  ngOnInit(): void {
    this.authSub = this.authService.loggedInUser.subscribe((loggedUser) => {
      this.loggedUser = loggedUser;
      if (
        this.loggedUser &&
        this.loggedUser.saved.length > 0 &&
        !this.wsSubscription
      ) {
        this.cryptoList = this.loggedUser.saved.map((symbol: string) => ({
          symbol,
          price_high: 0,
          price_low: 0,
        }));

        this.connectWebSocket();
      } else if (
        this.loggedUser &&
        this.loggedUser.saved.length > 0 &&
        this.wsSubscription
      ) {
        const newCurrencies = this.loggedUser.saved.filter(
          (currency) =>
            !this.cryptoList.some((crypto) => crypto.symbol === currency)
        );
        newCurrencies.forEach((currency) => {
          this.cryptoList.push({
            symbol: currency,
            price_high: 0,
            price_low: 0,
          });
        });
        this.wsSubscription.unsubscribe();
        this.currService.wsClose();
        this.connectWebSocket();
      }
    });
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
          (error) => console.error('error:', error)
        );
    }
  }

  updateCryptoList(message: any): void {
    console.log('MESSAGETYPE', message);
    const { symbol_id, price_high, price_low } = message;
    if (symbol_id) {
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
    }
  }

  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
    this.currService.wsClose();
    this.authSub.unsubscribe();
  }

  onCloseSavedCurr(crypto: string): void {
    const index = this.cryptoList.findIndex((item) => item.symbol === crypto);
    if (index === 0 && this.cryptoList.length < 1) {
      this.cryptoList = [];
      this.wsSubscription.unsubscribe();
      this.currService.wsClose();
    } else {
      this.cryptoList.splice(index, 1);
    }
    console.log(this.cryptoList);

    this.authService.deleteCrypto(crypto);
  }
}
