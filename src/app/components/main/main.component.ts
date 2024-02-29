import { Component, OnInit } from '@angular/core';
import { SymbolData } from 'src/app/models/currency.model';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  symbols!: SymbolData[];
  selectedTab = 1;
  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    // this.currencyService.getAllSymbols().subscribe((data) => {
    //   this.symbols = data;
    //   console.log(this.symbols);
    // });
  }
  selectTab(tabNummber: number) {
    this.selectedTab = tabNummber;
  }
}
