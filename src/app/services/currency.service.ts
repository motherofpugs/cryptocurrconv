import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SymbolData } from '../models/currency.model';

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
    const url = `${this.baseUrl}v1/symbols?filter_asset_id=USD`;
    return this.http.get<SymbolData[]>(url, { headers: this.headers });
  }
}
