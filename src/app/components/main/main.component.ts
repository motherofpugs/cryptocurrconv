import { LineChartData, SelectedId } from './../../models/currency.model';
import { Component, OnInit } from '@angular/core';
import { OHLCVData, SymbolData } from 'src/app/models/currency.model';
import { userSignup } from 'src/app/models/userSignup.model';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  loggedInUser!: userSignup | null;
  symbols!: SymbolData[];
  asset_ids: string[] = [];
  selectedTab?: LineChartData[];
  openedTabs: string[] = [];
  lineChartData!: LineChartData[];
  lineChartDatas: LineChartData[][] = [];
  selectedId!: SelectedId | undefined;
  constructor(
    private currencyService: CurrencyService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.loggedInUser.subscribe((loggedInUser) => {
      this.loggedInUser = loggedInUser;
    });
    this.currencyService.getAllSymbols().subscribe((data) => {
      this.symbols = data;
      this.asset_ids = [];
      this.symbols.forEach((symbol) => {
        this.asset_ids.push(symbol.asset_id_base);
      });
    });
  }

  selectTab(tabName: string) {
    const tab = this.lineChartDatas.find((data) =>
      data.some((chart) => chart.name === tabName)
    );
    if (tab) {
      this.selectedTab = tab;
    }
    const symbol = this.symbols.find(
      (symbol) => symbol.asset_id_base === tabName
    );
    if (symbol) {
      this.selectedId = {
        name: symbol.asset_id_base,
        rate: symbol.price,
      };
    }
  }
  onClickId(symbolId: string) {
    if (!this.openedTabs.includes(symbolId)) {
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
        this.lineChartDatas.push(this.lineChartData);
        this.symbols.forEach((symbol) => {
          if (symbol.asset_id_base === symbolId) {
            this.selectedId = {
              name: symbol.asset_id_base,
              rate: symbol.price,
            };
          }
        });
        this.openedTabs.push(symbolId);
        const tab = this.lineChartDatas.find((data) =>
          data.some((chart) => chart.name === symbolId)
        );
        if (tab) {
          this.selectedTab = tab;
        }
      });
    } else {
      this.lineChartDatas.forEach((data) => {
        data.forEach((tab) => {
          if (tab.name === symbolId) {
            this.selectedTab = data;
          }
        });
      });
    }
  }

  onCloseTab(tab: string) {
    const index = this.openedTabs.indexOf(tab);
    if (index !== -1) {
      this.openedTabs.splice(index, 1);
      if (this.openedTabs.length > 0) {
        const selectedTabName = this.openedTabs[Math.max(0, index - 1)];
        this.selectTab(selectedTabName);
      } else {
        this.selectedTab = undefined;
      }
    }
  }

  onSaveCrypto() {
    if (
      this.selectedId &&
      !this.loggedInUser?.saved.includes(this.selectedId.name)
    )
      this.auth.saveCrypto(this.selectedId.name);
  }
}
