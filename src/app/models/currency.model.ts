export interface SymbolData {
  exchange_id: string;
  symbol_id: string;
  symbol_type: string;
  asset_id_base: string;
  asset_id_quote: string;
  symbol_id_exchange: string;
  price: number;
  iconUrl?: string;
}

export interface OHLCVData {
  time_period_start: string;
  time_period_end: string;
  time_open: string;
  time_close: string;
  price_open: number;
  price_high: number;
  price_low: number;
  price_close: number;
  volume_traded: number;
  trades_count: number;
}

export interface SelectedId {
  name: string;
  rate: number;
}

export interface LineChartData {
  name: string;
  series: {
    name: string;
    value: number;
  }[];
}
