import { SelectedId } from './../../models/currency.model';
import { Component, OnInit } from '@angular/core';
import { symbol } from 'd3-shape';
import { OHLCVData, SymbolData } from 'src/app/models/currency.model';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  symbols!: SymbolData[];
  asset_ids: string[] = [];
  selectedTab = 1;
  lineChartData: any[] = [];
  selectedId!: SelectedId;
  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    // this.currencyService.getAllSymbols().subscribe((data) => {
    //   this.symbols = data;
    //   this.asset_ids = [];
    //   this.symbols.forEach((symbol) => {
    //     this.asset_ids.push(symbol.asset_id_base);
    //   });
    //   console.log(this.asset_ids); // This will contain unique exchange_ids
    //   console.log(this.symbols);
    // });
  }
  //   this.currencyService.getOHLCVData('BTC').subscribe((data) => {
  //     console.log(data);
  //     this.lineChartData = [
  //       {
  //         name: 'ETH',
  //         series: data.map((item: OHLCVData) => ({
  //           name: new Date(item.time_period_start).toLocaleDateString(),
  //           value: item.price_close,
  //         })),
  //       },
  //     ];
  //   });
  // }

  selectTab(tabNummber: number) {
    this.selectedTab = tabNummber;
  }

  onClickId(symbolId: string) {
    this.currencyService.getOHLCVData(symbolId).subscribe((data) => {
      console.log(data);
      this.lineChartData = [
        {
          name: symbolId,
          series: data.map((item: OHLCVData) => ({
            name: new Date(item.time_period_start).toLocaleDateString(),
            value: item.price_close,
          })),
        },
      ];
      this.symbols.forEach((symbol) => {
        if (symbol.exchange_id === symbolId) {
          this.selectedId = {
            name: symbol.exchange_id,
            rate: symbol.price,
          };
        }
      });
    });
    console.log(this.lineChartData);
  }
}
