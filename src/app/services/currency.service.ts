import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OHLCVData, SymbolData } from '../models/currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private baseUrl = 'https://rest.coinapi.io/';

  private headers = {
    'X-CoinAPI-Key': 'CB0DC487-D785-4A57-8C3A-F8DE4BEB5978',
  };

  constructor(private http: HttpClient) {}

  getAllSymbols(): Observable<SymbolData[]> {
    const url = `${this.baseUrl}v1/symbols?filter_exchange_id=BITSTAMP&filter_asset_id=USD`;
    return this.http.get<SymbolData[]>(url, { headers: this.headers });
  }

  getOHLCVData(symbolId: string): Observable<OHLCVData[]> {
    const endDate = new Date().toISOString();
    const startDate = new Date(
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    const url = `${this.baseUrl}v1/ohlcv/BITSTAMP_SPOT_${symbolId}_USD/history?period_id=1DAY&time_start=${startDate}&time_end=${endDate}`;
    return this.http.get<OHLCVData[]>(url, { headers: this.headers });
  }
}
