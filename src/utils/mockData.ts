import { Stock, MarketIndex, NewsItem, SectorPerformance, Portfolio, OHLCVData } from '@/types';

// Seeded random number generator for deterministic mock data
const seededRng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
};

const rand = seededRng(42);

const generateSparkline = (base: number, length = 20): number[] => {
  const arr: number[] = [base];
  for (let i = 1; i < length; i++) {
    arr.push(arr[i - 1] * (1 + (rand() - 0.5) * 0.04));
  }
  return arr;
};

const generateOHLCV = (base: number, count = 60): OHLCVData[] => {
  const data: OHLCVData[] = [];
  let price = base;
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const open = price;
    const movement = (rand() - 0.48) * price * 0.02;
    const close = price + movement;
    const high = Math.max(open, close) * (1 + rand() * 0.01);
    const low = Math.min(open, close) * (1 - rand() * 0.01);
    const volume = Math.floor(rand() * 50000000 + 10000000);
    data.push({ time: now - i * 86400000, open, high, low, close, volume });
    price = close;
  }
  return data;
};

export const MOCK_STOCKS: Stock[] = [
  {
    symbol: 'AAPL', name: 'Apple Inc.', price: 227.52, change: 3.18, changePercent: 1.42,
    volume: 62_480_200, avgVolume: 58_200_000, marketCap: 3_510_000_000_000,
    pe: 34.2, eps: 6.65, high52: 237.23, low52: 164.08, beta: 1.24,
    sector: 'Technology', industry: 'Consumer Electronics',
    shortFloat: 0.6, institutionalOwnership: 61.2, insiderOwnership: 3.4,
    dividendYield: 0.44, revenueGrowth: 4.9, earningsGrowth: 11.2,
    debtToEquity: 1.85, roe: 147.3, roa: 29.1, grossMargin: 46.2,
    operatingMargin: 31.4, netMargin: 25.6, freeCashFlow: 101_000_000_000,
    sparkline: generateSparkline(220, 24), signal: 'STRONG_BUY', score: 88,
    rsi: 62.4, macd: 1.24, macdSignal: 0.98, sma20: 224.10, sma50: 218.60, sma200: 196.40,
    atr: 3.82, bollingerUpper: 234.20, bollingerLower: 214.00,
    tags: ['Mega Cap', 'Dividend', 'AI Play'],
  },
  {
    symbol: 'NVDA', name: 'NVIDIA Corporation', price: 128.30, change: -2.84, changePercent: -2.17,
    volume: 312_450_000, avgVolume: 290_000_000, marketCap: 3_140_000_000_000,
    pe: 52.8, eps: 2.43, high52: 153.13, low52: 47.32, beta: 1.76,
    sector: 'Technology', industry: 'Semiconductors',
    shortFloat: 0.8, institutionalOwnership: 66.8, insiderOwnership: 4.1,
    dividendYield: 0.03, revenueGrowth: 122.4, earningsGrowth: 288.2,
    debtToEquity: 0.42, roe: 123.8, roa: 55.4, grossMargin: 74.6,
    operatingMargin: 54.1, netMargin: 49.3, freeCashFlow: 33_700_000_000,
    sparkline: generateSparkline(130, 24), signal: 'BUY', score: 82,
    rsi: 44.7, macd: -0.87, macdSignal: -0.42, sma20: 131.20, sma50: 118.40, sma200: 89.20,
    atr: 5.18, bollingerUpper: 148.30, bollingerLower: 118.10,
    tags: ['AI Leader', 'Semiconductor', 'High Vol'],
  },
  {
    symbol: 'MSFT', name: 'Microsoft Corporation', price: 448.82, change: 6.24, changePercent: 1.41,
    volume: 18_920_000, avgVolume: 20_100_000, marketCap: 3_340_000_000_000,
    pe: 38.4, eps: 11.69, high52: 468.35, low52: 309.45, beta: 0.89,
    sector: 'Technology', industry: 'Software',
    shortFloat: 0.5, institutionalOwnership: 72.4, insiderOwnership: 1.8,
    dividendYield: 0.68, revenueGrowth: 16.0, earningsGrowth: 21.4,
    debtToEquity: 0.34, roe: 38.2, roa: 15.4, grossMargin: 69.8,
    operatingMargin: 44.6, netMargin: 35.8, freeCashFlow: 74_100_000_000,
    sparkline: generateSparkline(442, 24), signal: 'BUY', score: 85,
    rsi: 58.9, macd: 2.18, macdSignal: 1.76, sma20: 443.20, sma50: 432.10, sma200: 398.60,
    atr: 6.24, bollingerUpper: 462.10, bollingerLower: 428.30,
    tags: ['Mega Cap', 'Cloud', 'AI Play', 'Dividend'],
  },
  {
    symbol: 'GOOGL', name: 'Alphabet Inc.', price: 192.40, change: -1.28, changePercent: -0.66,
    volume: 22_380_000, avgVolume: 24_500_000, marketCap: 2_360_000_000_000,
    pe: 24.8, eps: 7.76, high52: 207.05, low52: 129.40, beta: 1.02,
    sector: 'Communication Services', industry: 'Internet',
    shortFloat: 0.4, institutionalOwnership: 68.1, insiderOwnership: 11.2,
    dividendYield: 0.0, revenueGrowth: 13.6, earningsGrowth: 33.6,
    debtToEquity: 0.08, roe: 30.8, roa: 17.2, grossMargin: 56.4,
    operatingMargin: 27.4, netMargin: 24.0, freeCashFlow: 54_800_000_000,
    sparkline: generateSparkline(194, 24), signal: 'HOLD', score: 74,
    rsi: 51.2, macd: -0.24, macdSignal: 0.12, sma20: 194.80, sma50: 188.40, sma200: 167.20,
    atr: 4.12, bollingerUpper: 204.60, bollingerLower: 181.20,
    tags: ['Mega Cap', 'AI Play', 'Value'],
  },
  {
    symbol: 'META', name: 'Meta Platforms Inc.', price: 582.14, change: 12.44, changePercent: 2.18,
    volume: 14_620_000, avgVolume: 16_800_000, marketCap: 1_480_000_000_000,
    pe: 29.4, eps: 19.80, high52: 602.95, low52: 333.83, beta: 1.32,
    sector: 'Communication Services', industry: 'Social Media',
    shortFloat: 0.7, institutionalOwnership: 63.4, insiderOwnership: 13.6,
    dividendYield: 0.0, revenueGrowth: 27.2, earningsGrowth: 73.0,
    debtToEquity: 0.14, roe: 35.4, roa: 19.8, grossMargin: 81.4,
    operatingMargin: 38.6, netMargin: 34.2, freeCashFlow: 52_100_000_000,
    sparkline: generateSparkline(568, 24), signal: 'STRONG_BUY', score: 91,
    rsi: 68.4, macd: 4.28, macdSignal: 3.16, sma20: 572.40, sma50: 544.20, sma200: 468.80,
    atr: 9.84, bollingerUpper: 608.40, bollingerLower: 548.20,
    tags: ['AI Play', 'Growth', 'Momentum'],
  },
  {
    symbol: 'AMZN', name: 'Amazon.com Inc.', price: 218.74, change: 3.96, changePercent: 1.84,
    volume: 36_440_000, avgVolume: 40_200_000, marketCap: 2_310_000_000_000,
    pe: 44.2, eps: 4.95, high52: 230.15, low52: 151.61, beta: 1.18,
    sector: 'Consumer Discretionary', industry: 'E-Commerce',
    shortFloat: 0.6, institutionalOwnership: 60.4, insiderOwnership: 10.8,
    dividendYield: 0.0, revenueGrowth: 10.5, earningsGrowth: 94.0,
    debtToEquity: 0.54, roe: 22.4, roa: 7.8, grossMargin: 47.6,
    operatingMargin: 10.8, netMargin: 8.9, freeCashFlow: 38_200_000_000,
    sparkline: generateSparkline(213, 24), signal: 'BUY', score: 80,
    rsi: 57.8, macd: 1.82, macdSignal: 1.24, sma20: 215.40, sma50: 202.60, sma200: 180.40,
    atr: 5.64, bollingerUpper: 230.40, bollingerLower: 202.40,
    tags: ['Cloud', 'E-Commerce', 'Mega Cap'],
  },
  {
    symbol: 'TSLA', name: 'Tesla Inc.', price: 248.23, change: -8.64, changePercent: -3.36,
    volume: 98_640_000, avgVolume: 108_400_000, marketCap: 794_000_000_000,
    pe: 72.4, eps: 3.43, high52: 488.54, low52: 138.80, beta: 2.34,
    sector: 'Consumer Discretionary', industry: 'EVs',
    shortFloat: 3.2, institutionalOwnership: 42.6, insiderOwnership: 13.0,
    dividendYield: 0.0, revenueGrowth: -1.1, earningsGrowth: -55.0,
    debtToEquity: 0.22, roe: 8.4, roa: 4.2, grossMargin: 17.9,
    operatingMargin: 5.5, netMargin: 5.8, freeCashFlow: 2_800_000_000,
    sparkline: generateSparkline(260, 24), signal: 'SELL', score: 38,
    rsi: 35.2, macd: -4.82, macdSignal: -3.18, sma20: 263.80, sma50: 291.40, sma200: 244.60,
    atr: 14.28, bollingerUpper: 310.40, bollingerLower: 222.60,
    tags: ['High Vol', 'EV', 'Meme Stock'],
  },
  {
    symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 234.18, change: 1.84, changePercent: 0.79,
    volume: 10_240_000, avgVolume: 9_800_000, marketCap: 668_000_000_000,
    pe: 13.4, eps: 17.48, high52: 260.38, low52: 182.35, beta: 0.84,
    sector: 'Financials', industry: 'Banks',
    shortFloat: 0.5, institutionalOwnership: 73.4, insiderOwnership: 0.8,
    dividendYield: 2.14, revenueGrowth: 21.8, earningsGrowth: 16.4,
    debtToEquity: 1.24, roe: 17.8, roa: 1.34, grossMargin: 68.4,
    operatingMargin: 40.2, netMargin: 27.6, freeCashFlow: 24_800_000_000,
    sparkline: generateSparkline(231, 24), signal: 'HOLD', score: 68,
    rsi: 55.4, macd: 0.84, macdSignal: 0.62, sma20: 232.40, sma50: 226.80, sma200: 208.40,
    atr: 3.84, bollingerUpper: 244.80, bollingerLower: 220.80,
    tags: ['Value', 'Dividend', 'Financials'],
  },
  {
    symbol: 'PLTR', name: 'Palantir Technologies', price: 38.42, change: 2.84, changePercent: 7.98,
    volume: 128_480_000, avgVolume: 96_400_000, marketCap: 82_400_000_000,
    pe: 184.2, eps: 0.21, high52: 49.86, low52: 14.02, beta: 2.18,
    sector: 'Technology', industry: 'Software',
    shortFloat: 4.8, institutionalOwnership: 44.2, insiderOwnership: 9.4,
    dividendYield: 0.0, revenueGrowth: 30.0, earningsGrowth: 140.0,
    debtToEquity: 0.0, roe: 12.4, roa: 9.8, grossMargin: 81.2,
    operatingMargin: 14.8, netMargin: 14.2, freeCashFlow: 810_000_000,
    sparkline: generateSparkline(35, 24), signal: 'BUY', score: 76,
    rsi: 72.4, macd: 1.84, macdSignal: 1.12, sma20: 36.40, sma50: 30.20, sma200: 22.40,
    atr: 2.14, bollingerUpper: 42.80, bollingerLower: 31.40,
    tags: ['AI Play', 'Gov Contract', 'Momentum', 'High Vol'],
  },
  {
    symbol: 'AMD', name: 'Advanced Micro Devices', price: 164.28, change: -3.44, changePercent: -2.05,
    volume: 44_820_000, avgVolume: 48_400_000, marketCap: 266_000_000_000,
    pe: 102.4, eps: 1.60, high52: 227.30, low52: 111.88, beta: 1.84,
    sector: 'Technology', industry: 'Semiconductors',
    shortFloat: 1.2, institutionalOwnership: 68.4, insiderOwnership: 2.4,
    dividendYield: 0.0, revenueGrowth: 8.9, earningsGrowth: -88.0,
    debtToEquity: 0.04, roe: 3.8, roa: 2.4, grossMargin: 50.4,
    operatingMargin: 2.0, netMargin: 5.8, freeCashFlow: 1_400_000_000,
    sparkline: generateSparkline(169, 24), signal: 'HOLD', score: 58,
    rsi: 40.2, macd: -1.84, macdSignal: -0.94, sma20: 170.40, sma50: 178.20, sma200: 164.80,
    atr: 7.84, bollingerUpper: 194.40, bollingerLower: 148.40,
    tags: ['Semiconductor', 'AI Play'],
  },
  {
    symbol: 'SMCI', name: 'Super Micro Computer', price: 46.82, change: -4.28, changePercent: -8.37,
    volume: 82_640_000, avgVolume: 60_800_000, marketCap: 27_200_000_000,
    pe: 18.4, eps: 2.54, high52: 122.90, low52: 17.25, beta: 2.64,
    sector: 'Technology', industry: 'Hardware',
    shortFloat: 12.4, institutionalOwnership: 32.4, insiderOwnership: 14.8,
    dividendYield: 0.0, revenueGrowth: 109.8, earningsGrowth: 62.4,
    debtToEquity: 0.82, roe: 47.8, roa: 14.2, grossMargin: 13.4,
    operatingMargin: 9.8, netMargin: 7.4, freeCashFlow: -800_000_000,
    sparkline: generateSparkline(55, 24), signal: 'SELL', score: 32,
    rsi: 24.8, macd: -4.84, macdSignal: -2.94, sma20: 58.40, sma50: 71.20, sma200: 64.80,
    atr: 8.84, bollingerUpper: 80.40, bollingerLower: 38.40,
    tags: ['High Vol', 'Short Interest', 'AI Server'],
  },
  {
    symbol: 'COIN', name: 'Coinbase Global Inc.', price: 284.36, change: 18.48, changePercent: 6.95,
    volume: 24_480_000, avgVolume: 16_800_000, marketCap: 71_800_000_000,
    pe: 48.2, eps: 5.90, high52: 349.75, low52: 110.31, beta: 3.18,
    sector: 'Financials', industry: 'Crypto Exchange',
    shortFloat: 8.4, institutionalOwnership: 54.2, insiderOwnership: 16.4,
    dividendYield: 0.0, revenueGrowth: 108.4, earningsGrowth: 580.0,
    debtToEquity: 0.64, roe: 28.4, roa: 9.8, grossMargin: 74.2,
    operatingMargin: 24.8, netMargin: 26.4, freeCashFlow: 1_200_000_000,
    sparkline: generateSparkline(262, 24), signal: 'BUY', score: 72,
    rsi: 64.8, macd: 8.84, macdSignal: 6.24, sma20: 270.40, sma50: 244.80, sma200: 198.40,
    atr: 18.84, bollingerUpper: 328.40, bollingerLower: 224.40,
    tags: ['Crypto', 'High Vol', 'Growth'],
  },
];

export const MOCK_INDICES: MarketIndex[] = [
  { name: 'S&P 500', symbol: 'SPX', value: 5_648.40, change: 28.82, changePercent: 0.51, high: 5_658.40, low: 5_607.80, volume: 2_840_000_000, sparkline: generateSparkline(5600, 24) },
  { name: 'NASDAQ', symbol: 'NDX', value: 19_864.98, change: 124.48, changePercent: 0.63, high: 19_892.40, low: 19_644.20, volume: 4_840_000_000, sparkline: generateSparkline(19700, 24) },
  { name: 'Dow Jones', symbol: 'DJIA', value: 41_563.08, change: -84.64, changePercent: -0.20, high: 41_684.40, low: 41_484.20, volume: 982_000_000, sparkline: generateSparkline(41600, 24) },
  { name: 'Russell 2000', symbol: 'RUT', value: 2_217.84, change: 12.48, changePercent: 0.57, high: 2_228.40, low: 2_198.80, volume: 1_240_000_000, sparkline: generateSparkline(2200, 24) },
  { name: 'VIX', symbol: 'VIX', value: 16.84, change: -0.84, changePercent: -4.75, high: 18.24, low: 16.40, volume: 0, sparkline: generateSparkline(17, 24) },
  { name: 'DXY', symbol: 'DXY', value: 101.84, change: 0.24, changePercent: 0.24, high: 102.24, low: 101.48, volume: 0, sparkline: generateSparkline(102, 24) },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: '1', headline: 'NVIDIA Reports Record Revenue as AI Demand Surges to New Heights', summary: 'NVIDIA posted quarterly revenue of $30.0B, up 122% year-over-year, driven by explosive data center demand from hyperscalers.', source: 'Bloomberg', publishedAt: new Date(Date.now() - 1800000).toISOString(), sentiment: 'BULLISH', sentimentScore: 0.92, relatedSymbols: ['NVDA', 'AMD', 'SMCI'], category: 'Earnings' },
  { id: '2', headline: 'Federal Reserve Signals Potential Rate Cut in September Meeting', summary: 'Fed Chair Powell indicated the central bank is "getting closer" to cutting rates, sending equity markets higher.', source: 'Reuters', publishedAt: new Date(Date.now() - 3600000).toISOString(), sentiment: 'BULLISH', sentimentScore: 0.74, relatedSymbols: ['SPX', 'TLT', 'JPM'], category: 'Macro' },
  { id: '3', headline: 'Tesla Faces Headwinds as EV Competition Intensifies from Chinese Automakers', summary: 'Tesla Q2 deliveries missed estimates, raising concerns about market share erosion in China and Europe.', source: 'WSJ', publishedAt: new Date(Date.now() - 7200000).toISOString(), sentiment: 'BEARISH', sentimentScore: -0.68, relatedSymbols: ['TSLA'], category: 'Industry' },
  { id: '4', headline: 'Apple Set to Launch AI-Powered iPhone 16 with Groundbreaking Features', summary: 'Apple Intelligence features expected to drive a super-cycle upgrade wave, with analysts projecting 10-15% unit growth.', source: 'CNBC', publishedAt: new Date(Date.now() - 10800000).toISOString(), sentiment: 'BULLISH', sentimentScore: 0.84, relatedSymbols: ['AAPL', 'QCOM', 'TSM'], category: 'Product' },
  { id: '5', headline: 'Super Micro Computer Delays Annual Report Filing, Raises Accounting Concerns', summary: 'SMCI announced it will delay its 10-K filing, citing the need for additional time to assess internal controls.', source: 'MarketWatch', publishedAt: new Date(Date.now() - 14400000).toISOString(), sentiment: 'BEARISH', sentimentScore: -0.91, relatedSymbols: ['SMCI'], category: 'Regulatory' },
  { id: '6', headline: 'Meta AI Investments Pay Off as Revenue Grows 28% in Q2', summary: "Meta's Advantage+ AI ad platform drives significant ROI improvements, with CFO guiding for continued double-digit growth.", source: 'FT', publishedAt: new Date(Date.now() - 18000000).toISOString(), sentiment: 'BULLISH', sentimentScore: 0.88, relatedSymbols: ['META', 'GOOGL', 'SNAP'], category: 'Earnings' },
  { id: '7', headline: 'Palantir Secures $480M DoD Contract for AI-Enabled Battlefield Systems', summary: 'PLTR wins critical defense contract, expanding its government AI footprint and validating its AIP platform.', source: 'Defense News', publishedAt: new Date(Date.now() - 21600000).toISOString(), sentiment: 'BULLISH', sentimentScore: 0.78, relatedSymbols: ['PLTR'], category: 'Contract' },
  { id: '8', headline: 'Coinbase Volume Surges as Bitcoin Retests $65K Resistance Level', summary: 'Crypto trading activity spikes on Coinbase as institutional flows pick up ahead of anticipated ETF inflows.', source: 'CoinDesk', publishedAt: new Date(Date.now() - 25200000).toISOString(), sentiment: 'BULLISH', sentimentScore: 0.66, relatedSymbols: ['COIN', 'MSTR', 'RIOT'], category: 'Crypto' },
];

export const MOCK_SECTORS: SectorPerformance[] = [
  { sector: 'Technology', change: 248_000_000_000, changePercent: 1.82, marketCap: 14_800_000_000_000, volume: 8_400_000_000, stocks: 428, topMover: 'NVDA', color: '#0a84ff' },
  { sector: 'Communication Services', change: 84_000_000_000, changePercent: 1.44, marketCap: 5_920_000_000_000, volume: 2_840_000_000, stocks: 118, topMover: 'META', color: '#5ac8fa' },
  { sector: 'Consumer Discretionary', change: -42_000_000_000, changePercent: -0.82, marketCap: 5_140_000_000_000, volume: 3_240_000_000, stocks: 248, topMover: 'AMZN', color: '#ff9f0a' },
  { sector: 'Financials', change: 28_000_000_000, changePercent: 0.44, marketCap: 6_380_000_000_000, volume: 1_840_000_000, stocks: 334, topMover: 'JPM', color: '#30d158' },
  { sector: 'Health Care', change: -18_000_000_000, changePercent: -0.28, marketCap: 6_240_000_000_000, volume: 1_480_000_000, stocks: 442, topMover: 'LLY', color: '#ff375f' },
  { sector: 'Industrials', change: 14_000_000_000, changePercent: 0.22, marketCap: 4_380_000_000_000, volume: 984_000_000, stocks: 382, topMover: 'GE', color: '#bf5af2' },
  { sector: 'Energy', change: -8_000_000_000, changePercent: -0.38, marketCap: 2_140_000_000_000, volume: 840_000_000, stocks: 128, topMover: 'XOM', color: '#ffd60a' },
  { sector: 'Real Estate', change: 4_000_000_000, changePercent: 0.18, marketCap: 1_280_000_000_000, volume: 420_000_000, stocks: 164, topMover: 'PLD', color: '#64d2ff' },
  { sector: 'Materials', change: -2_000_000_000, changePercent: -0.14, marketCap: 1_480_000_000_000, volume: 380_000_000, stocks: 142, topMover: 'NEM', color: '#ff6961' },
  { sector: 'Utilities', change: 6_000_000_000, changePercent: 0.42, marketCap: 1_140_000_000_000, volume: 280_000_000, stocks: 118, topMover: 'NEE', color: '#4cd964' },
  { sector: 'Consumer Staples', change: -4_000_000_000, changePercent: -0.18, marketCap: 3_240_000_000_000, volume: 680_000_000, stocks: 198, topMover: 'WMT', color: '#5856d6' },
];

export const MOCK_PORTFOLIO: Portfolio = {
  totalValue: 248_740.82,
  totalCost: 184_200.00,
  totalUnrealizedPnL: 64_540.82,
  totalUnrealizedPnLPercent: 35.04,
  dayPnL: 2_840.18,
  dayPnLPercent: 1.15,
  cash: 24_800.00,
  sharpeRatio: 1.84,
  sortinRatio: 2.12,
  maxDrawdown: -18.4,
  volatility: 22.4,
  beta: 1.24,
  alpha: 8.4,
  positions: [
    { symbol: 'AAPL', name: 'Apple Inc.', quantity: 120, avgCost: 178.40, currentPrice: 227.52, totalValue: 27_302.40, totalCost: 21_408.00, unrealizedPnL: 5_894.40, unrealizedPnLPercent: 27.54, dayPnL: 381.60, weight: 12.4, sector: 'Technology', beta: 1.24 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', quantity: 200, avgCost: 48.20, currentPrice: 128.30, totalValue: 25_660.00, totalCost: 9_640.00, unrealizedPnL: 16_020.00, unrealizedPnLPercent: 166.18, dayPnL: -568.00, weight: 11.6, sector: 'Technology', beta: 1.76 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', quantity: 60, avgCost: 384.20, currentPrice: 448.82, totalValue: 26_929.20, totalCost: 23_052.00, unrealizedPnL: 3_877.20, unrealizedPnLPercent: 16.82, dayPnL: 374.40, weight: 12.2, sector: 'Technology', beta: 0.89 },
    { symbol: 'META', name: 'Meta Platforms Inc.', quantity: 40, avgCost: 312.80, currentPrice: 582.14, totalValue: 23_285.60, totalCost: 12_512.00, unrealizedPnL: 10_773.60, unrealizedPnLPercent: 86.10, dayPnL: 497.60, weight: 10.6, sector: 'Comm. Services', beta: 1.32 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', quantity: 80, avgCost: 168.40, currentPrice: 218.74, totalValue: 17_499.20, totalCost: 13_472.00, unrealizedPnL: 4_027.20, unrealizedPnLPercent: 29.89, dayPnL: 316.80, weight: 7.9, sector: 'Cons. Disc.', beta: 1.18 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 100, avgCost: 158.20, currentPrice: 192.40, totalValue: 19_240.00, totalCost: 15_820.00, unrealizedPnL: 3_420.00, unrealizedPnLPercent: 21.62, dayPnL: -128.00, weight: 8.7, sector: 'Comm. Services', beta: 1.02 },
    { symbol: 'PLTR', name: 'Palantir Technologies', quantity: 500, avgCost: 18.40, currentPrice: 38.42, totalValue: 19_210.00, totalCost: 9_200.00, unrealizedPnL: 10_010.00, unrealizedPnLPercent: 108.80, dayPnL: 1_420.00, weight: 8.7, sector: 'Technology', beta: 2.18 },
    { symbol: 'JPM', name: 'JPMorgan Chase', quantity: 80, avgCost: 196.40, currentPrice: 234.18, totalValue: 18_734.40, totalCost: 15_712.00, unrealizedPnL: 3_022.40, unrealizedPnLPercent: 19.24, dayPnL: 147.20, weight: 8.5, sector: 'Financials', beta: 0.84 },
  ],
};

export const generateOHLCVData = (symbol: string): OHLCVData[] => {
  const basePrices: Record<string, number> = {
    AAPL: 227.52, NVDA: 128.30, MSFT: 448.82, GOOGL: 192.40, META: 582.14,
    AMZN: 218.74, TSLA: 248.23, JPM: 234.18, PLTR: 38.42, AMD: 164.28,
  };
  return generateOHLCV(basePrices[symbol] || 100, 90);
};