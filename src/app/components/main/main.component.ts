import { Component, OnInit } from '@angular/core';
import { OHLCVData, SymbolData } from 'src/app/models/currency.model';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  symbols!: SymbolData[];
  selectedTab = 1;
  lineChartData: any[] = [];
  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    // this.currencyService.getAllSymbols().subscribe((data) => {
    //   this.symbols = data;
    //   console.log(this.symbols);
    // });
    // this.currencyService.getOHLCVData('BTC').subscribe((data) => {
    //   console.log(data);
    //   this.lineChartData = [
    //     {
    //       name: 'ETH',
    //       series: data.map((item: OHLCVData) => ({
    //         name: new Date(item.time_period_start).toLocaleDateString(),
    //         value: item.price_close,
    //       })),
    //     },
    //   ];
    // });
  }
  selectTab(tabNummber: number) {
    this.selectedTab = tabNummber;
  }
}
