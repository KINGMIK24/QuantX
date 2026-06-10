import { useState, useEffect, useCallback, useRef } from 'react';
import { Stock, MarketIndex, NewsItem } from '@/types';
import { MOCK_STOCKS, MOCK_INDICES, MOCK_NEWS } from '@/utils/mockData';

interface UseMarketDataReturn {
  stocks: Stock[];
  indices: MarketIndex[];
  news: NewsItem[];
  isLoading: boolean;
  lastUpdate: Date;
  refreshData: () => void;
}

const simulateTickerUpdate = (stocks: Stock[]): Stock[] => {
  return stocks.map((stock) => {
    const volatility = stock.beta * 0.001;
    const priceChange = stock.price * (Math.random() - 0.499) * volatility;
    const newPrice = Math.max(0.01, stock.price + priceChange);
    const newChange = stock.change + priceChange;
    const newChangePercent = (newChange / (newPrice - newChange)) * 100;

    return {
      ...stock,
      price: Math.round(newPrice * 100) / 100,
      change: Math.round(newChange * 100) / 100,
      changePercent: Math.round(newChangePercent * 100) / 100,
      volume: stock.volume + Math.floor(Math.random() * 100000),
      rsi: Math.max(10, Math.min(90, stock.rsi + (Math.random() - 0.5) * 0.5)),
      sparkline: [...stock.sparkline.slice(1), Math.round(newPrice * 100) / 100],
    };
  });
};

const simulateIndexUpdate = (indices: MarketIndex[]): MarketIndex[] => {
  return indices.map((index) => {
    const volatility = 0.0004;
    const change = index.value * (Math.random() - 0.499) * volatility;
    const newValue = Math.max(0.01, index.value + change);
    const newChange = index.change + change;
    const newChangePercent = (newChange / (newValue - newChange)) * 100;
    return {
      ...index,
      value: Math.round(newValue * 100) / 100,
      change: Math.round(newChange * 100) / 100,
      changePercent: Math.round(newChangePercent * 100) / 100,
      sparkline: [...index.sparkline.slice(1), Math.round(newValue * 100) / 100],
    };
  });
};

export const useMarketData = (): UseMarketDataReturn => {
  const [stocks, setStocks] = useState<Stock[]>(MOCK_STOCKS);
  const [indices, setIndices] = useState<MarketIndex[]>(MOCK_INDICES);
  const [news] = useState<NewsItem[]>(MOCK_NEWS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<any | null>(null);

  const tick = useCallback(() => {
    setStocks((prev) => simulateTickerUpdate(prev));
    setIndices((prev) => simulateIndexUpdate(prev));
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(tick, 1500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  return { stocks, indices, news, isLoading, lastUpdate, refreshData };
};