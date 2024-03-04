import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OHLCVData, SymbolData } from '../models/currency.model';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private baseUrl = 'https://rest.coinapi.io/';
  private apiKey = '540349B3-A91A-4269-89C8-972BAA369D18';
  private headers = {
    'X-CoinAPI-Key': this.apiKey,
  };
  private wsUrl = 'wss://ws.coinapi.io/v1/';
  ws!: WebSocketSubject<any>;

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

  wsConnect(cryptos: string[]) {
    this.ws = new WebSocketSubject(this.wsUrl);
    const savedCryptoIds = cryptos.map(
      (crypto) => `BITSTAMP_SPOT_${crypto}_USD$`
    );
    console.log('saved', savedCryptoIds);
    const message = {
      type: 'hello',
      apikey: this.apiKey,
      heartbeat: false,
      subscribe_data_type: ['ohlcv'],
      subscribe_filter_symbol_id: savedCryptoIds,
      subscribe_filter_period_id: ['1MIN'],
    };
    console.log('wsmessage:', message);
    this.ws.next(message);
    return this.ws;
  }
  wsClose(): void {
    this.ws.complete();
  }
}
