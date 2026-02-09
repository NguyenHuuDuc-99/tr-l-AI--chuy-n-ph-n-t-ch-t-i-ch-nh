export interface StockCriteria {
  value: boolean;
  reason: string;
}

export interface HistoricalPoint {
  date: string;
  price: number;
}

export interface StockData {
  current_price: string;
  symbol: string;
  historical_data: HistoricalPoint[];
  criteria: {
    // FA
    rev_growth_pos: StockCriteria;
    val_attractive: StockCriteria;
    health_safe: StockCriteria;
    story_clear: StockCriteria;
    // TA
    trend_up: StockCriteria;
    price_abv_ma: StockCriteria;
    vol_support: StockCriteria;
    indicators_good: StockCriteria;
    // MOM
    news_support: StockCriteria;
    foreign_buy: StockCriteria;
  };
}

export interface ScoreResult {
  faScore: number;
  taScore: number;
  momScore: number;
  totalScore: number;
  rating: string;
  action: string;
  reasons: string[];
}

export interface SavedAnalysis {
  id: string;
  symbol: string;
  date: string;
  result: ScoreResult;
  data: StockData;
}
