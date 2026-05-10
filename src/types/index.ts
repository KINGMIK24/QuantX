// ─── Core Market Types ────────────────────────────────────────────────────────

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  pe: number;
  eps: number;
  high52: number;
  low52: number;
  beta: number;
  sector: string;
  industry: string;
  shortFloat: number;
  institutionalOwnership: number;
  insiderOwnership: number;
  dividendYield: number;
  revenueGrowth: number;
  earningsGrowth: number;
  debtToEquity: number;
  roe: number;
  roa: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  freeCashFlow: number;
  sparkline: number[];
  signal: 'BUY' | 'SELL' | 'HOLD' | 'STRONG_BUY' | 'STRONG_SELL';
  score: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  sma20: number;
  sma50: number;
  sma200: number;
  atr: number;
  bollingerUpper: number;
  bollingerLower: number;
  tags: string[];
}

export interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayPnL: number;
  weight: number;
  sector: string;
  beta: number;
}

export interface Portfolio {
  totalValue: number;
  totalCost: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPnLPercent: number;
  dayPnL: number;
  dayPnLPercent: number;
  cash: number;
  positions: PortfolioPosition[];
  sharpeRatio: number;
  sortinRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  sparkline: number[];
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  publishedAt: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentimentScore: number;
  relatedSymbols: string[];
  category: string;
}

export interface SectorPerformance {
  sector: string;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  stocks: number;
  topMover: string;
  color: string;
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'VOLUME_SURGE' | 'RSI_OVERBOUGHT' | 'RSI_OVERSOLD' | 'MACD_CROSS';
  value: number;
  triggered: boolean;
  createdAt: string;
  message: string;
}

export interface ScreenerFilter {
  minPrice?: number;
  maxPrice?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  minVolume?: number;
  maxVolume?: number;
  minPE?: number;
  maxPE?: number;
  minRSI?: number;
  maxRSI?: number;
  sectors?: string[];
  signals?: Array<Stock['signal']>;
  minScore?: number;
  minRevenueGrowth?: number;
  minEarningsGrowth?: number;
}

export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W' | '1M';
export type ViewMode = 'dashboard' | 'markets' | 'portfolio' | 'screener' | 'analytics' | 'terminal';
export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}