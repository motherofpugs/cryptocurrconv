import { symbol } from 'd3-shape';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { userSignup } from 'src/app/models/userSignup.model';
import { CurrencyService } from 'src/app/services/currency.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() onclickId!: any;

  loggedUser!: userSignup | null;
  wsSubscription!: Subscription;
  cryptoList: { symbol: string; price_high?: number; price_low?: number }[] =
    [];

  ngOnInit(): void {
    this.authService.loggedInUser.subscribe((loggedUser) => {
      this.loggedUser = loggedUser;
      if (this.loggedUser && this.loggedUser.saved) {
        this.cryptoList = this.loggedUser.saved.map((symbol: string) => ({
          symbol,
          price_high: 0,
          price_low: 0,
        }));
        if (!this.wsSubscription && this.loggedUser.saved.length > 0)
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

  onCloseSavedCurr(crypto: string): void {
    const index = this.cryptoList.findIndex((item) => item.symbol === crypto);
    if (index === 0) {
      this.cryptoList = [];
      this.wsSubscription.unsubscribe();
      this.currService.wsClose();
    } else {
      this.cryptoList.splice(index, 1);
    }

    console.log(crypto);
    this.authService.deleteCrypto(crypto);
  }
}
